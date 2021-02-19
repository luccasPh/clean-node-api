import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'

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
