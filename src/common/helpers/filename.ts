import { v1 } from 'uuid'

export const editFileName = (req, file, callback) => {
	const name = file.originalname.split('.')[0]
	const fileExtName = file.originalname.split('.')[1]
	callback(null, `${name}-${v1()}.${fileExtName}`)
}
