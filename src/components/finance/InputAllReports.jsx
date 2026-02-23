import { Table, Button, Container, Form, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

const InputAllReports = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // GET
  useEffect(() => {
    axios
      .get("https://xacker007.pythonanywhere.com/accounts/list_create")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []); 

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://xacker007.pythonanywhere.com/accounts/${id}/`
      );
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT
  const handleEdit = (user) => {
    setEditUser({ ...user });
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  // SAVE (PATCH)
  const handleSave = async () => {
    try {
      await axios.patch(
        `https://xacker007.pythonanywhere.com/accounts/${editUser.id}/`,
        editUser
      );

      setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
      setEditUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      {/* TABLE */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ism</th>
            <th>Telefon</th>
            <th>Balans</th>
            <th>Davr bo‘yicha jami</th>
            <th>Guruh</th>
            <th>Holati</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.ism}</td>
              <td>{user.telefon}</td>
              <td>{user.balans}</td>
              <td>{user.davr_boyicha_jami}</td>
              <td>{user.guruh}</td>
              <td>{user.holati}</td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  className="me-2"
                  onClick={() => handleEdit(user)}
                >
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* UPDATE FORM */}
      {editUser && (
        <Card className="p-3 mt-4">
          <h5>Update User</h5>

          <Form.Control
            className="mb-2"
            name="ism"
            value={editUser.ism}
            onChange={handleChange}
            placeholder="Ism"
          />

          <Form.Control
            className="mb-2"
            name="telefon"
            value={editUser.telefon}
            onChange={handleChange}
            placeholder="Telefon"
          />

          <Form.Control
            className="mb-2"
            name="balans"
            value={editUser.balans}
            onChange={handleChange}
            placeholder="Balans"
          />

          <Form.Control
            className="mb-2"
            name="davr_boyicha_jami"
            value={editUser.davr_boyicha_jami}
            onChange={handleChange}
            placeholder="Davr bo‘yicha jami"
          />

          <Form.Control
            className="mb-2"
            name="guruh"
            value={editUser.guruh}
            onChange={handleChange}
            placeholder="Guruh"
          />

          <Form.Control
            className="mb-3"
            name="holati"
            value={editUser.holati}
            onChange={handleChange}
            placeholder="Holati"
          />

          <Button variant="success" onClick={handleSave}>
            Saqlash
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default InputAllReports;
