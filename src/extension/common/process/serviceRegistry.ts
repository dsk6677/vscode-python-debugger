// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IServiceManager } from '../../debugger/ioc/types';
import { ProcessServiceFactory } from './processFactory';
// import { PythonExecutionFactory } from './pythonExecutionFactory';
// import { PythonToolExecutionService } from './pythonToolService';
import { IProcessServiceFactory } from './types';

export function registerTypes(serviceManager: IServiceManager) {
    serviceManager.addSingleton<IProcessServiceFactory>(IProcessServiceFactory, ProcessServiceFactory);
    // serviceManager.addSingleton<IPythonExecutionFactory>(IPythonExecutionFactory, PythonExecutionFactory);
    // serviceManager.addSingleton<IPythonToolExecutionService>(IPythonToolExecutionService, PythonToolExecutionService);
}
