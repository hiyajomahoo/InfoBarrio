import Follow from '../models/follow.model.js'

export const followUser = async (req, res) => {
  const follower_id = req.user?.id
  const { followed_id } = req.body
  if (!follower_id) return res.status(401).json({ message: 'No autenticado' })
  if (Number(follower_id) === Number(followed_id)) return res.status(400).json({ message: 'No puedes seguirte a ti mismo' })
  try {
    await Follow.follow({ follower_id, followed_id })
    return res.status(201).json({ message: 'Siguiendo' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al seguir' })
  }
}

export const unfollowUser = async (req, res) => {
  const follower_id = req.user?.id
  const followed_id = req.params.followedId
  if (!follower_id) return res.status(401).json({ message: 'No autenticado' })
  try {
    await Follow.unfollow({ follower_id, followed_id })
    return res.status(200).json({ message: 'Dejado de seguir' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al dejar de seguir' })
  }
}

export const getFollowers = async (req, res) => {
  const user_id = req.params.userId
  try {
    const rows = await Follow.followersOf(user_id)
    return res.status(200).json(rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al obtener followers' })
  }
}

export const getFollowing = async (req, res) => {
  const user_id = req.params.userId
  try {
    const rows = await Follow.followingOf(user_id)
    return res.status(200).json(rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al obtener following' })
  }
}

export default { followUser, unfollowUser, getFollowers, getFollowing }
