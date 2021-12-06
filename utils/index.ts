export const cloudinaryUrl = (url?: string) =>
  !url && url !== 'null'
    ? undefined
    : `https://res.cloudinary.com/ankitadancestudio/image/upload/w_720,c_scale,f_auto,q_auto:best/${url}`