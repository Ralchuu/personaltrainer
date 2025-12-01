export type Customer = {
  id?: number
  firstname?: string
  lastname?: string
  streetaddress?: string
  postcode?: string
  city?: string
  email?: string
  phone?: string
  _links?: Record<string, any>
}

export type CustomerForm = {
  firstname: string
  lastname: string
  streetaddress?: string
  postcode?: string
  city?: string
  email?: string
  phone?: string
}
