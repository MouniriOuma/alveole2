import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";
import LineChart from "../../components/LineChart";
import DoughnutChart from "../../components/DoughnutChart";

function Stock() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div>
            <Header title="Stock" />
            {/* move this later to the prod cost page*/}
            <LineChart />
            <DoughnutChart />
        </div>
    );
}

export default Stock;
