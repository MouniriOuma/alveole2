import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../base/Header";

function Stock() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div>
            <Header title="Stock" />
            {/* move this later to the prod cost page*/}
            {/*<LineChart />
            <DoughnutChart />*/}
        </div>
    );
}

export default Stock;
