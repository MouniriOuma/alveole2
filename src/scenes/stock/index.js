import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import LineChart from "../../components/Linechart";

function Stock() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Header title="STOCK" subtitle="All products stock" />
            {/* move this later to the prod cost page*/}
            <LineChart />
            {/*<DoughnutChart />*/}
        </Box>
    );
}

export default Stock;
