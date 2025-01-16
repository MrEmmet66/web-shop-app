import { useGetUserProfileQuery, useLogoutMutation } from "@/features/auth/authEndpoints"
import { resetAuthState } from "@/features/auth/authSlice"
import { useAppDispatch } from "@/redux/hooks"
import { Modal, Button } from "antd"
import { User } from "../user"

function UserMiniProfileModal({ visible, onCancel, user }: { visible: boolean, onCancel: () => void, user: User }) {
  
  const [logout] = useLogoutMutation()
  const appDispatch = useAppDispatch()

  const handleLogout = async () => {
    await logout({}).then(() => {
        appDispatch(resetAuthState())
    })
  }

  return (
    <Modal title="User Profile" open={visible} onCancel={onCancel} footer={null}>
    
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <Button onClick={handleLogout} style={{ marginTop: "10px" }}>Logout</Button>
        </div>
    </Modal>
  )
}
export default UserMiniProfileModal