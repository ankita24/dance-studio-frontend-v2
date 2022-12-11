export interface Profile {
  name: string
  location: string
  email: string
  phone: number
  image: string
  images: Array<string>
  lat: number
  long: number
  rooms: number
  area: number
  cost: number
  duration: number
  isSoundProof?: boolean
  hasChangingRoom?: boolean
  availabilty: { day: string; timings: { start: Date; end: Date }[],enable?:boolean }[]
  __t: 'OwnerSchema' | 'UserSchema'
  deviceToken: string
}

export interface Studio {
  __t: 'OwnerSchema' | 'UserSchema'
  __v: number
  _id: string
  area: number
  cost: number
  distance: number
  duration: number
  email: string
  image: string
  images: Array<string>
  lat: number
  location: string
  long: number
  name: string
  rooms: number
  isSoundProof?: boolean
  hasChangingRoom?: boolean,
  deviceToken?:string
}

export interface StudioWithSlots extends Studio {
  slots: string[]
}

export interface Bookings {
  _id: string
  price: number
  slot: string
  date: Date
}

export interface UserBookings extends Bookings {
  studioDetails: {
    email: string
    name: string
    location?: string
  }
  studioId: string
}

export interface StudioBookings extends Bookings {
  userDetails: {
    email: string
    name: string
  }
  studioDetails: {
    email: string
    name: string
    location?: string
  }
  userId: string
}
