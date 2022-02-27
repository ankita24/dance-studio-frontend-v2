export interface Profile {
  name: string
  location: string
  email: string
  image: string
  images: string[]
  lat: number
  long: number
  rooms: number
  area: number
  cost: number
  duration: number
  availabilty: [{ day: string; timings: [{ start: Date; end: Date }] }]
  __t: 'OwnerSchema' | 'UserSchema'
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
  images: string[]
  lat: number
  location: string
  long: number
  name: string
  rooms: number
}

export interface StudioWithSlots extends Studio {
  slots: string[]
}

export interface Bookings {
  _id: string
  price: number
  slot: string
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
  userId: string
}
