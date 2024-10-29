import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space, Menu, Modal, Input } from 'antd';
import { db } from "../Config/Firebase";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

const Header = () => {
    const [admindata, setAdmindata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

    // State for Update Profile
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [currentAdminId, setCurrentAdminId] = useState(null);

    const collectionRef = collection(db, "Admin");

    const getdata = async () => {
        try {
            setLoading(true);
            const data = await getDocs(collectionRef);
            const filterData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            if (filterData.length > 0) {
                setAdmindata(filterData);
                setAdminEmail(filterData[0].email);  // Assume first admin data
                setAdminPassword(filterData[0].password);
                setCurrentAdminId(filterData[0].id);
            }
        } catch (error) {
            console.error("Error Fetching Data...", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPassword');
        navigate('/');
    };

    const handleUpdateProfile = async () => {
        if (!currentAdminId) return;

        try {
            const adminRef = doc(db, 'Admin', currentAdminId);
            await updateDoc(adminRef, {
                email: adminEmail,
                password: adminPassword,
            });

            setIsUpdateModalVisible(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile: ', error);
            alert('Error updating profile');
        }
    };

    const items = [
        { key: '1', label: 'My Account', disabled: true },
        { type: 'divider' },
        { key: '4', label: (<span onClick={() => setIsUpdateModalVisible(true)}><SettingOutlined /> Update Profile</span>) },
        { type: 'divider' },
        { type: 'divider' },
        { key: '6', label: 'Logout', onClick: handleLogout, style: { color: 'red' } },
    ];

    return (
        <>
            <div className="container-fluid">
                <div className="row" style={{ padding: "5px" }}>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <h1>
                            <marquee behavior="scroll" direction="right" scrollamount="10">
                                Welcome to Sogat
                            </marquee>
                        </h1>
                    </div>
                    <div className="col-4 d-flex justify-content-end pt-3">
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


            {/* Modal for Updating Profile */}
            <Modal
                title="Update Profile"
                visible={isUpdateModalVisible}
                onOk={handleUpdateProfile}
                onCancel={() => setIsUpdateModalVisible(false)}
            >
                <Input
                    placeholder="Email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                />
                <Input.Password
                    placeholder="Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={{ marginTop: '10px' }}
                />
            </Modal>
        </>
    );
}

export default Header;
