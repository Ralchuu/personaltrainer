export type SimpleCustomer = {
  id?: number
  firstname?: string
  lastname?: string
}

export type Customer = {
  id?: number
  firstname?: string
  lastname?: string
  email?: string
  phone?: string
  streetaddress?: string
  postcode?: string
  city?: string
  _links?: any
}

export type Training = {
  id?: number
  date?: string
  activity?: string
  duration?: number | string
  customer?: SimpleCustomer
  _links?: any
}
