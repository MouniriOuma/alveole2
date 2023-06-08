import {useState} from "react";
import { useLocation } from 'react-router-dom';
import {Route, Routes} from "react-router-dom";
import Topbar from './scenes/base/Topbar';
import Sidebar from "./scenes/base/Sidebar";
import Dashboard from "./scenes/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
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
import ProdCostForm from "./components/ProdCostForm";
import LoginForm from "./scenes/Login";
import ListProdCost from "./scenes/productionCost";
import ProductForm from "./components/CreateOrUpdateProduct";
import ViewProduct from "./scenes/product/ViewProduct";
import ViewSupplier from "./scenes/suppliers/ViewSupplier";
import ViewClient from "./scenes/clients/ViewClient";
import ViewIngredient from "./scenes/ingredient/ViewIngredient";
import ViewBill from "./scenes/bills/ViewBill";
import ViewWaterElec from "./scenes/waterElec/ViewWaterElec";
import ViewProductionCost from "./scenes/productionCost/ViewProductionCost";
import Stock from "./scenes/stock";


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
                {/* login */}
                  <Route path="/" element={<LoginForm />} />
                {/* Dashbord */}
                  <Route path="/Dashboard" element={<Dashboard />} />
                {/* Client */}
                  <Route path = "/clients" element = {<ListClients />} />
                  <Route path = "/add-client/:id" element = {<ClientForm />} />
                  <Route path = "/edit-client/:id" element = {<ClientForm />} />
                  <Route path = "/view-client/:id" element = {<ViewClient />} />
                {/* Calendar */}
                  <Route path = "/calendar" element = {<Calendar />} />
                {/* User */}
                  <Route path = "/users" element = {<ListUsers />} />
                  <Route path = "/add-user/:id" element = {<UserForm />} />
                  <Route path = "/add-user/:id" element = {<UserForm />} />
                  <Route path = "/edit-user/:id" element = {<UserForm />} />
                {/* Ingredient */}
                  <Route path = "/ingredients" element = {<ListIngredients />} />
                  <Route path = "/add-ingredient/:id" element = {<IngredientForm />} />
                  <Route path = "/edit-ingredient/:id" element = {<IngredientForm />} />
                  <Route path = "/view-ingredient/:id" element = {<ViewIngredient />} />
                  {/* Bill */}
                  <Route path = "/bills" element = {<ListBills />} />
                  <Route path = "/add-bill/:id" element = {<BillForm />} />
                  <Route path = "/edit-bill/:id" element = {<BillForm />} />
                  <Route path = "/view-bill/:id" element = {<ViewBill />} />
                {/* Water / electricity */}
                  <Route path = "/waterElecs" element = {<ListWaterElec />} />
                  <Route path = "/add-waterElecs/:id" element = {<WaterElecForm />} />
                  <Route path = "/edit-waterElecs/:id" element = {<WaterElecForm />} />
                  <Route path = "/view-waterElecs/:id" element = {<ViewWaterElec />} />
                {/* Supplier */}
                  <Route path = "/suppliers" element = {<ListSuppliers />} />
                  <Route path = "/add-supplier/:id" element = {<SupplierForm />} />
                  <Route path = "/edit-supplier/:id" element = {<SupplierForm />} />
                  <Route path = "/view-supplier/:id" element = {<ViewSupplier />} />
                {/* Product */}
                  <Route path = "/products" element = {<ListProducts />} />
                  <Route path = "/add-product/:id" element = {<ProductForm />} />
                  <Route path = "/edit-product/:id" element = {<ProductForm />} />
                  <Route path = "/view-product/:id" element = {<ViewProduct />} />
                {/* Production cost */}
                  <Route path = "/production_cost" element = {<ListProdCost />} />
                  <Route path = "/add-production-cost" element = {<ProdCostForm />} />
                  <Route path = "/view-production-cost/:id" element = {<ViewProductionCost />} />
                  {/* Stock */}
                  <Route path = "/stock" element = {<Stock />} />
                  </Routes>
                </main>
            </div>

      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
