import {useState} from "react";
import { useLocation } from 'react-router-dom';
import {Route, Routes} from "react-router-dom";
import Topbar from './scenes/base/Topbar';
import Sidebar from "./scenes/base/Sidebar";
import Dashboard from "./scenes/dashboard";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme";
import ListClients from "./scenes/clients";
import ClientForm from "./components/CreateOrUpdateClient";
import Calendar from "./scenes/calendar/calendar";
import ListUsers from './scenes/user';
import ListSuppliers from './scenes/suppliers'
import ListProducts from "./scenes/product";
import ListIngredients from "./scenes/ingredient";
import IngredientForm from "./components/CreateOrUpdateIngredient";
import UserForm from "./components/CreateOrUpdateUser";
import ListBills from "./scenes/bills";
import BillForm from "./components/CreateOrUpdateBill";
import ListWaterElec from "./scenes/waterElec";
import WaterElecForm from "./components/CreateOrUpdateWaterElec";
import SupplierForm from "./components/CreateOrUpdateSupplier";
import ProdFees from "./scenes/productionCost";
import ProdFeesForm from "./components/ProdFeesForm";
import LoginForm from "./scenes/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {isSidebar && location.pathname !== '/' && <Sidebar isSidebar={isSidebar} />} {/* Show Sidebar conditionally */}
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} /> {/* Always show the Topbar */}
              <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                    {/* ... Other routes */}
                  <Route path = "/clients" element = {<ListClients />} />
                  <Route path = "/add-client/:id" element = {<ClientForm />} />
                  <Route path = "/edit-client/:id" element = {<ClientForm />} />
                  <Route path = "/calendar" element = {<Calendar />} />
                  <Route path = "/users" element = {<ListUsers />} />
                  <Route path = "/add-user/:id" element = {<UserForm />} />
                  <Route path = "/add-user/_add" element = {<UserForm />} />
                  <Route path = "/edit-user/:id" element = {<UserForm />} />
                  <Route path = "/ingredients" element = {<ListIngredients />} />
                  <Route path = "/add-ingredient/:id" element = {<IngredientForm />} />
                  <Route path = "/edit-ingredient/:id" element = {<IngredientForm />} />
                  <Route path = "/bills" element = {<ListBills />} />
                  <Route path = "/add-bill/:id" element = {<BillForm />} />
                  <Route path = "/edit-bill/:id" element = {<BillForm />} />
                  <Route path = "/waterElecs" element = {<ListWaterElec />} />
                  <Route path = "/add-waterElecs/:id" element = {<WaterElecForm />} />
                  <Route path = "/edit-waterElecs/:id" element = {<WaterElecForm />} />
                  <Route path = "/suppliers" element = {<ListSuppliers />} />
                  <Route path = "/add-supplier/:id" element = {<SupplierForm />} />
                  <Route path = "/edit-supplier/:id" element = {<SupplierForm />} />
                  <Route path = "/products" element = {<ListProducts />} />
                  <Route path = "/add-product/:id" element = {<SupplierForm />} />
                  <Route path = "/edit-product/:id" element = {<SupplierForm />} />

                  <Route path = "/production_cost" element = {<ProdFees />} />
                  <Route path = "/add-prod-cost/_add" element = {<ProdFeesForm />} />
                  </Routes>
                </main>
            </div>

      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
