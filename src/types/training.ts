export type Training = {
  id?: number
  date?: string
  duration?: number | string
  activity?: string
  customer?: { firstname?: string; lastname?: string } | string
  _links?: Record<string, any>
}

export type TrainingForm = {
  date: string
  duration: number
  activity: string
  customer: string
}
