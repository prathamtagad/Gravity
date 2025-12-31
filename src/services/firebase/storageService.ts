const MAX_IMAGE_SIZE = 1024 * 1024
const MAX_DIMENSION = 800

const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = (height * MAX_DIMENSION) / width
            width = MAX_DIMENSION
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = (width * MAX_DIMENSION) / height
            height = MAX_DIMENSION
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create blob'))
            }
          },
          'image/jpeg',
          0.85
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to convert file to Base64'))
    reader.readAsDataURL(file)
  })
}

export const uploadProfileImage = async (
  _userId: string,
  file: File
): Promise<string> => {
  try {
    if (file.size > MAX_IMAGE_SIZE) {
      const resizedBlob = await resizeImage(file)
      const resizedFile = new File([resizedBlob], file.name, {
        type: 'image/jpeg',
      })

      if (resizedFile.size > MAX_IMAGE_SIZE) {
        throw new Error(
          `Image is too large. Maximum size is ${MAX_IMAGE_SIZE / 1024}KB`
        )
      }

      return await fileToBase64(resizedFile)
    }

    return await fileToBase64(file)
  } catch (error) {
    console.error('Error converting image to Base64:', error)
    throw error
  }
}

export const deleteProfileImage = async (_imagePath: string): Promise<void> => {
  console.log('Base64 image deletion is handled by profile updates')
}
