import { logError } from '../utils/functions'

export const action = async (message: Error): Promise<void> => logError(message)
