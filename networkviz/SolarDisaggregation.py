from __future__ import division
#import pandas as pd
import numpy as np
import os.path
import datetime
import scipy as sp
from cvxopt import matrix,sparse,solvers,spmatrix

## CONTEXTUALLY SUPERVISED DISAGGREGATION USING ONLY THE l-2 norms
def disaggregateSolar(alpha,aggregateSignal,predictors,verbose=False):
    """ This function implements a sum of squared errors version of CSSE using cvxopt.
        Input structure:
        ******
        predictors is a dictionary composed of model_name and list of lists:
        Total number of lists (i.e. number of models){M}
        Each list has to be equal length {N},
        ******
        aggregateSignal is a list: Its lenght has to be {NM by 1},
        ******
        alpha is a list: Its size has to be equal to the number of models {M by 1}"""

    model_count=len(predictors) ## Number of models
    model_names=list(predictors.keys())

    if (model_count>0):
        if verbose:
            print('There are '+str(model_count)+ ' models')
    else:
        raise Exception("No predictors!")
    if len(alpha)!=model_count:
        raise Exception("Length of alpha doesn't match with number of models in predcitors!")

    ## GET THE ELEMENTS IN EACH PREDITCION TIME SERIES
    M=len(predictors[model_names[0]])
    Pmatrix=[]
    for elem in model_names:
        Pmatrix=sp.linalg.block_diag(Pmatrix,alpha[elem]*np.identity(M))
    ## Convert it to P notation CVX opt
    Pmatrix=Pmatrix*2

    ## Let's create the B matrices:
    Bmatrix_low=[]
    Bmatrix_up=[]
    for elem in model_names:
        Bmatrix_low=sp.linalg.block_diag(Bmatrix_low,-1*np.transpose(predictors[elem]))
        Bmatrix_up=sp.linalg.block_diag(Bmatrix_up,np.identity(M))
    Bmatrix=np.vstack((Bmatrix_up,Bmatrix_low))

    Pmatrix=np.dot(Bmatrix,Pmatrix)
    Pmatrix=np.dot(Pmatrix,np.transpose(Bmatrix))

    #return Pmatrix
    ct=0
    for elem in model_names:
        indModelLength=len(predictors[elem][0])
        if ct==0:
            Amatrix_left=np.identity(M)
            Amatrix_right=np.zeros((M,indModelLength))
        else:
            Amatrix_left=np.hstack((Amatrix_left,np.identity(M)))
            Amatrix_right=np.hstack((Amatrix_right,np.zeros((M,indModelLength))))
        ct=+1
    Amatrix=np.hstack((Amatrix_left,Amatrix_right))
    q=np.zeros((Amatrix.shape[1],1))

    P=matrix(Pmatrix)
    q=matrix(q)
    A=matrix(Amatrix)
    b=matrix(aggregateSignal,(M,1))
    if verbose:
        print('Size of P:')
        print(P.size)
        print('Size of q:')
        print(q.size)
        print('*****')
        print('Size of A:')
        print(A.size)
        print('Size of b:')
        print(b.size)

    sol = solvers.qp(P=P,q=q,A=A,b=b)
    print('****Solution status:'+str(sol['status'])+'****')
    results=list(sol['x'])
    disaggregatedSignal=[]
    i=0
    disaggregatedSignal={}
    for elem in model_names:
        disaggregatedSignal[elem]=results[(i)*M:(i+1)*M]
        i=i+1

    ### MODELS ARE ALL THE WAY AT THE END
    models={}
    models_start=(i)*M

    for elem in model_names:
        indModelLength=len(predictors[elem][0])
        models[elem]=results[models_start:models_start+indModelLength]
        models_start=models_start+indModelLength


    return sol,models,disaggregatedSignal

## RealTime Disaggregation Function For Aggregate Solar
## MT 2016-09-28

def realtimeDisagg(aggregateLoad,models,alpha,predictors):
    ## Get expected values as matrix
    expected_values = {}
    for model in alpha:
        model_exp = np.dot(predictors[model] , models[model])
        model_exp = matrix(model_exp,     (len(solar_exp),1))
        expected_values[model] = model_exp

    ## Find total expected value as sum of each model's expected value
    expected_values['total'] = matrix(0, (len(aggregateLoad),1))
    for model in alpha:
        expected_values['total'] = expected_values['total'] + expected_values[model]

    ## Find residuals as difference between aggregate load and expected values.
    residuals = matrix(aggregateLoad, (len(aggregateLoad),1)) - expected_values['total']

    ## Find total denominator
    denom = 0
    for key,value in alpha.items():
        denom = denom + 1/value

    ## Disaggregate each signal
    disaggSig = {}
    for model in alpha:
        disaggSig[model] = 1/alpha[model]/denom * residual + model_exp

    return(disaggSig)

def createTempInput(temp, size):
    minTemp=min(temp)
    maxTemp=max(temp)
    minBound=int(np.floor(minTemp / size)) * size
    maxBound=int(np.floor(maxTemp / size)) * size + size
    rangeCount=int((maxBound-minBound) / 10)
    result=[]
    for elem in temp:
        fullRanges=int(np.floor((elem-minBound) / size))
        lastRange=elem-(minBound+fullRanges*size)
        res=[size for elem in range(fullRanges)]
        res.append(lastRange)
        for var in range(rangeCount-fullRanges-1):
            res.append(0)
        res.append(1)
        result.append(res)
    return result


def scipy_sparse_to_spmatrix(A):
    coo = A.tocoo()
    SP = spmatrix(coo.data.tolist(), coo.row.tolist(), coo.col.tolist(), size=A.shape)
    return SP


def disaggregateSolarIndividualSparse(alphas,predictors,model_names,net_loads,verbose=False):

    model_count=len(model_names) ## Number of models
    if (model_count>0):
        if verbose:
            print('There are '+str(model_count)+ ' models')
    else:
        raise Exception("No predictors!")
    alpha_len=len(alphas)
    ## EACH MODEL HAS A UNIQUE ALPHA
    if alpha_len !=model_count:
        raise Exception("Length of alpha doesn't match with number of models in predcitors!")

    ## GET THE ELEMENTS IN EACH PREDICTION TIME SERIES
    M=len(predictors[model_names[0]])
    ct=0
    for elem in alphas:
        if ct==0:
            Pmatrix=elem*sp.sparse.identity(M)
        else:
            Pmatrix=sp.sparse.block_diag([Pmatrix,elem*sp.sparse.identity(M)])
        ct=ct+1
    ## Convert it to P notation CVX opt
    Pmatrix=Pmatrix*2
    ## Let's create the B matrices:
    ## Here we are assuming that the solution X=[AL, S1,..SN,L1,....LN,Theta-al,Theta-1,...ThetaN]
    Bmatrix_mid=sp.sparse.csr_matrix((np.zeros([M*(model_count-1),M*model_count])))

    ct=0
    for elem in model_names:
        if ct==0:
            Bmatrix_low=sp.sparse.csr_matrix(-1*np.transpose(predictors[elem]))
            Bmatrix_up=sp.sparse.identity(M)
        else:
            Bmatrix_low=sp.sparse.block_diag([Bmatrix_low,-1*np.transpose(predictors[elem])])
            Bmatrix_up=sp.sparse.block_diag([Bmatrix_up,np.identity(M)])
        ct=ct+1

    Bmatrix=sp.sparse.vstack([Bmatrix_up,Bmatrix_mid,Bmatrix_low])
    Pmatrix=np.dot(Bmatrix,Pmatrix)
    Pmatrix=np.dot(Pmatrix,np.transpose(Bmatrix))
    #return Pmatrix

    ct=0
    for elem in model_names:
        indModelLength=len(predictors[elem][0])
        if ct==0:
            Amatrix_right=sp.sparse.csr_matrix(np.zeros((M,indModelLength)))
            Amatrix_top_left=sp.sparse.identity(M)
        else:
            Amatrix_right=sp.sparse.block_diag([Amatrix_right,sp.sparse.csr_matrix(np.zeros((M,indModelLength)))])
            Amatrix_top_left=sp.sparse.hstack([Amatrix_top_left,sp.sparse.csr_matrix(np.zeros((M,M)))])
            if ct==1:
                Amat_left_zeros=sp.sparse.csr_matrix(np.zeros((M,M)))
                Amatrix_top_right=-1*sp.sparse.identity(M)
                Amat=sp.sparse.identity(M)
            else:
                Amat=sp.sparse.block_diag([Amat,np.identity(M)])
                Amatrix_top_right=sp.sparse.hstack([Amatrix_top_right,-1*sp.sparse.identity(M)])
                Amat_left_zeros=sp.sparse.vstack([Amat_left_zeros,sp.sparse.csr_matrix(np.zeros((M,M)))])
        ct=ct+1

    Amatrix_top=sp.sparse.hstack([Amatrix_top_left,Amatrix_top_right])
    Amatrix=sp.sparse.hstack([Amat_left_zeros,Amat,Amat])
    Amatrix=sp.sparse.vstack([Amatrix_top,Amatrix])
    Amatrix=sp.sparse.hstack([Amatrix,Amatrix_right])

    ### LET's CREATE AN H MATRIX THAT IMPOSE S=<0 L>=0
    ct=0
    for elem in model_names:
        indModelLength=len(predictors[elem][0])
        ## 0 idx corresponds to
        if ct==0:
            Hmatrix_right=sp.sparse.csr_matrix(np.zeros((M,indModelLength)))

        else:
            Hmatrix_right=sp.sparse.hstack([Hmatrix_right,sp.sparse.csr_matrix(np.zeros((M,indModelLength)))])
            if ct==1:
                Hmatrix_left=sp.sparse.csr_matrix(np.zeros((M,M)))
                Hmatrix_blk_solar=sp.sparse.identity(M)
                Hmatrix_blk_load=-1*sp.sparse.identity(M)
            else:
                Hmatrix_left=sp.sparse.vstack([Hmatrix_left,sp.sparse.csr_matrix(np.zeros((M,M)))])
                Hmatrix_blk_solar=sp.sparse.block_diag([Hmatrix_blk_solar,sp.sparse.identity(M)])
                Hmatrix_blk_load=sp.sparse.block_diag([Hmatrix_blk_load,-1*sp.sparse.identity(M)])
        ct=ct+1

    for elem in range(0,2*(len(model_names)-1)):
        if elem==0:
            Hmatrix_right_block=Hmatrix_right
        else:
            Hmatrix_right_block=sp.sparse.vstack([Hmatrix_right_block,Hmatrix_right])


    Hmatrix_mid=sp.sparse.block_diag([Hmatrix_blk_solar,Hmatrix_blk_load])
    Hmatrix_left=sp.sparse.vstack([Hmatrix_left,Hmatrix_left])


    Hmatrix=sp.sparse.hstack([Hmatrix_left,Hmatrix_mid])
    Hmatrix=sp.sparse.hstack([Hmatrix,Hmatrix_right_block])

    q=np.zeros((Amatrix.shape[1],1))
    P=scipy_sparse_to_spmatrix(Pmatrix)
    q=matrix(q)
    G=scipy_sparse_to_spmatrix(Hmatrix)
    A=scipy_sparse_to_spmatrix(Amatrix)
    #b=matrix(aggregateSignal,(M*(len(data_ids)+1),1))
    b=matrix(np.vstack((np.zeros((M,1)),net_loads)))
    h=matrix(np.vstack((np.multiply(0,net_loads),np.multiply(0,net_loads))))

    if verbose:
        print('Size of P:')
        print(P.size)
        print('Size of q:')
        print(q.size)
        print('*****')
        print('Size of A:')
        print(A.size)
        print('Size of b:')
        print(b.size)
        print('Size of G:')
        print(G.size)
        print('Size of h:')
        print(h.size)

    sol = solvers.qp(P=P,q=q,A=A,b=b,G=G,h=h)
    print('****Solution status:'+str(sol['status'])+'****')
    results=list(sol['x'])
    ## Here we are assuming that the solution
    ## X=[AL, S1,..SN,L1,....LN,Theta-al,Theta-1,...ThetaN]
    i=0
    disaggregatedSignal={}
    for elem in model_names:
        disaggregatedSignal[elem]=results[(i)*M:(i+1)*M]
        i=i+1

    individualLoads={}
    for elem in model_names[1:]:
        individualLoads[elem]=results[(i)*M:(i+1)*M]
        i=i+1
    ### MODELS ARE ALL THE WAY AT THE END
    models={}
    models_start=(i)*M

    for elem in model_names:
        indModelLength=len(predictors[elem][0])
        models[elem]=results[models_start:models_start+indModelLength]
        models_start=models_start+indModelLength
    return sol,models,disaggregatedSignal,individualLoads,results



## CONTEXTUALLY SUPERVISED DISAGGREGATION USING ONLY THE l-2 norms
## THIS VERSION SOLVES AN AGGREGATE MINIMIZATION
def disaggregateSolarAMI(alpha,aggregateSignal,predictors,model_names,data_ids,verbose=False):
    """ This function implements a sum of squared errors version of CSSE using cvxopt.
        Input structure:
        ******
        predictors is a dictionary composed of model_name and list of lists:
        Total number of lists (i.e. number of models){M}
        Each list has to be equal length {N},
        ******
        aggregateSignal is a list: Its lenght has to be {NM by 1},
        ******
        alpha is a dict: Its size has to be equal to the number of models {M by 1}"""

    model_count=len(predictors) ## Number of models
    if (model_count>0):
        if verbose:
            print('There are '+str(model_count)+ ' models')
    else:
        raise Exception("No predictors!")
    if len(alpha)!=model_count:
        raise Exception("Length of alpha doesn't match with number of models in predcitors!")

    ## GET THE ELEMENTS IN EACH PREDICTION TIME SERIES
    M=len(predictors[model_names[0]])
    Pmatrix=[]
    for elem in alpha:
        Pmatrix=sp.linalg.block_diag(Pmatrix,elem*np.identity(M))
    ## Convert it to P notation CVX opt
    Pmatrix=Pmatrix*2
    ## Let's create the B matrices:
    Bmatrix_low=[]
    Bmatrix_up=[]
    for elem in model_names:
        Bmatrix_low=sp.linalg.block_diag(Bmatrix_low,-1*np.transpose(predictors[elem]))
        Bmatrix_up=sp.linalg.block_diag(Bmatrix_up,np.identity(M))
    Bmatrix=np.vstack((Bmatrix_up,Bmatrix_low))
    Pmatrix=np.dot(Bmatrix,Pmatrix)
    Pmatrix=np.dot(Pmatrix,np.transpose(Bmatrix))
    #return Pmatrix
    ct=0
    for elem in model_names:
        indModelLength=len(predictors[elem][0])
        if ct==0:
            Amatrix_left=np.identity(M)
            Amatrix_right=np.zeros((M,indModelLength))
        else:
            Amatrix_left=np.hstack((Amatrix_left,np.identity(M)))
            Amatrix_right=np.hstack((Amatrix_right,np.zeros((M,indModelLength))))
        ct=ct+1
    Amatrix=np.hstack((Amatrix_left,Amatrix_right))
    constructA=np.hstack((np.identity(M),np.identity(M)))

    Amat=[]
    ct=0
    for elem in data_ids:
        if ct==0:
            Amat=constructA
            Amatright=Amatrix_right
        else:
            Amat=sp.linalg.block_diag(Amat,constructA)
            Amatright=np.vstack((Amatright,Amatrix_right))
        ct=ct+1

    #Amatrix=np.vstack((Amatrix,np.hstack((Amat,Amatright))))
    Amatrix=np.hstack((Amat,Amatright))


    q=np.zeros((Amatrix.shape[1],1))
    P=matrix(Pmatrix)
    q=matrix(q)
    A=matrix(Amatrix)
    #b=matrix(aggregateSignal,(M*(len(data_ids)+1),1))
    b=matrix(aggregateSignal,(M*(len(data_ids)),1))

    if verbose:
        print('Size of P:')
        print(P.size)
        print('Size of q:')
        print(q.size)
        print('*****')
        print('Size of A:')
        print(A.size)
        print('Size of b:')
        print(b.size)

    sol = solvers.qp(P=P,q=q,A=A,b=b)
    print('****Solution status:'+str(sol['status'])+'****')
    results=list(sol['x'])
    disaggregatedSignal=[]
    i=0
    disaggregatedSignal={}
    for elem in model_names:
        disaggregatedSignal[elem]=results[(i)*M:(i+1)*M]
        i=i+1
    models={}
    for elem in model_names:
        indModelLength=len(predictors[elem][0])
        models[elem]=results[model_count*M:model_count*M+indModelLength]

    return sol,models,disaggregatedSignal

def get_ith_element_of_dict(dictionary,i):
    "Function to get ith element of dict as dict"
    res_dict={}
    for elem in dictionary:
        res_dict[elem]= [dictionary[elem][i]]
    return res_dict

def get_till_ith_element_of_dict(dictionary,i):
    "Function to get ith element of dict as dict"
    res_dict={}
    for elem in dictionary:
        res_dict[elem]= dictionary[elem][0:i]
    return res_dict


def realtimeDisaggInvdSol(alphas,predictors,model_names,agg_netload,models):
    #  Function to disaggregate individual solar signals from aggregate net load in real time.
    #     As of now, the optimization does not apply the constraint that S<0 and L>0
    #
    # Inputs
    #  alphas     : weights for each model.  A list with one element for each model name, in order of model names
    #  predictors : dictionary with one element for each model, element names correspond to model_names.
    #                Each element is a dictionary
    #                of predictors for each model, there must be one predictor variable for each model coefficient
    #  models     : dictionary with one element for each model, element names correspond to model_names.
    #                Dictionary elements are lists of coefficients for each model
    #  model_names : list of model names
    #  agg_netload : the aggregate net_load at the feeder.
    #
    #

    N = len(model_names)-1
    ## Get expected values as matrix
    expected_values = {}
    for model in model_names:
        model_exp = np.dot(predictors[model] , models[model])
        model_exp = matrix(model_exp,     (len(model_exp),1))
        expected_values[model] = model_exp

    ## Find total expected value as sum of each model's expected value
    expected_values['total'] = matrix(0, (len(expected_values[model_names[0]]), 1))
    for model in model_names:
        expected_values['total'] = expected_values['total'] + expected_values[model]

    ## Find residuals as difference between aggregate load and expected values.
    residuals = matrix(agg_netload, (len(agg_netload),1)) - expected_values['total']

    ## Find total denominator
    # separate the load alpha from the solar alphas
    denom = 0
    for m in np.arange(0,len(model_names)):
        denom = denom + 1/alphas[m]/N

    disaggSig = {}
    for m in np.arange(0,len(model_names)):
        model = model_names[m]
        disaggSig[model] = 1/alphas[m]/denom/N * residuals + expected_values[model]

    return(disaggSig)
