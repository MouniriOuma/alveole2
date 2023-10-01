import {useEffect, useState} from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import SensorOccupiedOutlinedIcon from '@mui/icons-material/SensorOccupiedOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import UserService from "../../services/UserService";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");

  //define user role
  const username = localStorage.getItem('username');
  const [role, setRole] = useState('');

    useEffect(() => {

        UserService.getUserRoleByUsername(username)
            .then((response) => {

                const roleNames = response.data;
                if (roleNames.includes('ROLE_USER') && !roleNames.includes('ROLE_ADMIN')) {
                    setRole('user');

            } else if (roleNames.includes('ROLE_ADMIN')) {
                    setRole('admin');
                } else {
                    setRole('');
                }
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });
    }, [username]);

    function isUserRole(role) {
        return role.includes('user') && !role.includes('admin');
    }

    const isUser = isUserRole(role);
    const navigate = useNavigate();

    const handleLogout = () => {
        UserService.logout()
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Error logging out', error);
            });
    };

    return (
    <Box

      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                  <Typography variant="h3" color={colors.grey[100]}>
                      {role.includes('admin') ? 'ADMIN' : role.includes('user') ? 'USER' : ''}
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center"  >
              <AccountCircleIcon 
              color="action"
              fontSize="large"
              style={{ cursor: "pointer", borderRadius: "50%" , fontSize: 100}}

              />

              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {username}
                </Typography>
                <Typography variant="h4" color={colors.greenAccent[500]}>
                    {role.includes('admin') ? 'ADMIN' : role.includes('user') ? 'USER' : ''}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>

              {role.includes('admin') && (
                  <Item
                      title="Calcul de prix produit"
                      to="/product-cost"
                      icon={<CategoryOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                  />
              )}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
              {role.includes('admin') && (
                  <Item
                      title="Utilisateurs"
                      to="/users"
                      icon={<EngineeringOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                  />
              )}
              <Item
              title="Fournisseurs"
              to="/suppliers"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Clients"
              to="/clients"
              icon={<SensorOccupiedOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>

            <Item
              title="Produits"
              to="/products"
              icon={<CategoryOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Ingredients"
              to="/ingredients"
              icon={<ScienceOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Facture à payer"
              to="/bills"
              icon={<DescriptionIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Factures d'eau et électricité "
              to="/waterElecs"
              icon={<ReceiptLongIcon />}
              selected={selected}
              setSelected={setSelected}
            />
              <Item
                  title="Bons de commande"
                  to="/BonDeCommande"
                  icon={<ReceiptLongIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="Bons de livraison"
                  to="/BonDeLivraison"
                  icon={<ReceiptLongIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="Facture"
                  to="/Facture"
                  icon={<ReceiptLongIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
            



            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >             
            </Typography>
            <Item
              title="Déconnecter"
              to="/"
              icon={<LogoutIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={handleLogout}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;