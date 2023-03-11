const _User = require('../models/userModel')

const authPermission = permission => {
    console.log(permission)
    return (req, res, next) => {
        const {userId} = req.body
        if (!userId) {
            return res.status(403).json({
                message: 'You need sign in!'
            })
        }
        const user = _User.find({_id: userId})
        if (!user) {
            return res.status(404).json({
                message: 'User not found!'
            })
        }
        const {roles} = user
        if (roles !== 'admin') {
            return res.status(403),json({
                message: `You don't have permission!`
            })
        }

        next()
    }
}

module.exports = authPermission