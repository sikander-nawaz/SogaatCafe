import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space, Menu, Modal, Input } from 'antd';
import { db } from "../Config/Firebase";
import { collection, addDoc } from 'firebase/firestore';

const DashBoard = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    navigate('/'); 
  };

  const handleCreateUser = async () => {
    try {
      // Create a new user document in the 'Users' collection
      await addDoc(collection(db, 'Users'), {
        email: userEmail,
        password: userPassword, // Store passwords securely in practice
      });
      setUserEmail('');
      setUserPassword('');
      setIsModalVisible(false);
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user: ', error);
      alert('Error creating user');
    }
  };

  const items = [
    {
      key: '1',
      label: 'My Account',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: (
        <span>
          <SettingOutlined /> Settings
        </span>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '5',
      label: (
        <span onClick={() => setIsModalVisible(true)}>
          Create User
        </span>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '6',
      label: 'Logout',
      onClick: handleLogout,
      style: { color: 'red' },
    },
  ];

  return (
    <div>
      <h2>DashBoard</h2>
      <Dropdown
        overlay={<Menu items={items} />}
        trigger={['click']}
        style={{ cursor: "pointer" }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space style={{ cursor: "pointer" }}>
            Hover me
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>

      <Modal
        title="Create User"
        visible={isModalVisible}
        onOk={handleCreateUser}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input 
          placeholder="Email" 
          value={userEmail} 
          onChange={(e) => setUserEmail(e.target.value)} 
        />
        <Input.Password 
          placeholder="Password" 
          value={userPassword} 
          onChange={(e) => setUserPassword(e.target.value)} 
          style={{ marginTop: '10px' }} 
        />
      </Modal>
    </div>
  );
};

export default DashBoard;
