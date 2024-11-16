import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined , UserOutlined} from '@ant-design/icons';
import { Dropdown, Space, Menu , Avatar} from 'antd';

const UserHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };
    const items = [
        { key: '1', label: 'My Account', disabled: true },
        { type: 'divider' },
        { key: '6', label: 'Logout', onClick: handleLogout, style: { color: 'red' } },
    ];

    return (
        <>
            <div className="container-fluid">
                <div className="row" style={{ padding: "5px" }}>
                    <div className="col-8">
                        <h1 style={{ fontFamily: "Times New Roman", fontWeight: "bold", color: "#333" }}>
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
                                <Avatar
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: '#1677FF' }}
                                    />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserHeader;
