import {
  SaveSurveyResult,
  SaveSurveyResultRepository,
  SaveSurveyResultParams,
  SurveyResultModel,
  LoadSurveyResultRepository
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  private readonly loadSurveyResultRepository: LoadSurveyResultRepository

  constructor (
    saveSurveyResultRepository: SaveSurveyResultRepository,
    loadSurveyResultRepository: LoadSurveyResultRepository) {
    this.saveSurveyResultRepository = saveSurveyResultRepository
    this.loadSurveyResultRepository = loadSurveyResultRepository
  }

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel | undefined> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
    if (surveyResult) {
      return surveyResult
    }
  }
}
