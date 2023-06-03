import React from 'react';
import { Box } from '@mui/material';
import Header from "../base/Header";


const Dashboard = () => {
    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems='center' >
                <Header title="DASHBOARD" subtitle="welcome to the dashboard" />
            </Box>
        </Box>
        
    );
};

export default Dashboard;