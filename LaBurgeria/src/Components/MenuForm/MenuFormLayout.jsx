import React, { useState } from 'react';
import { Container, Paper, Typography, Divider } from '@mui/material';
import CreateMenu from './CreateMenu';
import InsertCombo from './InsertCombo';
import InsertProduct from './InsertProduct';
import './MenuFormLayout.css';
import BannerBackground from '../../assets/home-banner-background.png';


const MenuFormLayout = () => {
    const [menu, setMenu] = useState(null);

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <img src={BannerBackground} alt="Banner" className="banner-image" />

            <Paper elevation={3} style={{ padding: '2rem', borderRadius: '8px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Gestión del Menú
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />
                
                <Typography variant="h6" gutterBottom>
                    Crear Menú
                </Typography>
                <CreateMenu setMenu={setMenu} />
                
                <Divider style={{ margin: '1rem 0' }} />
                
                {/* Mostrar InsertCombo e InsertProduct solo si menu existe */ console.log(menu)}
                {menu && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Insertar Combo
                        </Typography>
                        <InsertCombo menuID={menu.MenúID} />
                        
                        <Divider style={{ margin: '1rem 0' }} />
                        
                        <Typography variant="h6" gutterBottom>
                            Insertar Producto
                        </Typography>
                        <InsertProduct menuID={menu.MenúID} />
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default MenuFormLayout;
