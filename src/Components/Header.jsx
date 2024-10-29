import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space, Menu, Modal, Input } from 'antd';
import { db } from "../Config/Firebase";
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import Logo from "../Assets/Images/SOGAAT FLAVOUR FIRE-02.png"


const Header = () => {


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
            const usersRef = collection(db, 'Users');
            const emailQuery = query(usersRef, where('email', '==', userEmail));
            const querySnapshot = await getDocs(emailQuery);

            if (!querySnapshot.empty) {
                alert('User already exists!');
                return;
            }

            await addDoc(usersRef, {
                email: userEmail,
                password: userPassword,
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
                    <SettingOutlined /> My Profile
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
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-4">
                        <img src={Logo} alt="" width={100} height={100}/>
                    </div>
                    <div className="col-4">
                        Welcome to Sogat
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                        <Dropdown
                            overlay={<Menu items={items} />}
                            trigger={['click']}
                            style={{ cursor: "pointer" }}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space style={{ cursor: "pointer", textDecoration: "none", color: "black", fontSize: "20px" }}>
                                    Manage Account
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </div>
            </div>





























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
        </>
    )
}

export default Header