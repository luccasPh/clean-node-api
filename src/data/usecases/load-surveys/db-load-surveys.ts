import { LoadSurveys, LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  private readonly loadSurveysLoadSurveysRepository: LoadSurveysRepository

  constructor (loadSurveysLoadSurveysRepository: LoadSurveysRepository) {
    this.loadSurveysLoadSurveysRepository = loadSurveysLoadSurveysRepository
  }

  async load (): Promise<SurveyModel[] | null> {
    const surveys = await this.loadSurveysLoadSurveysRepository.loadAll()
    if (surveys) {
      return surveys
    }
    return null
  }
}
