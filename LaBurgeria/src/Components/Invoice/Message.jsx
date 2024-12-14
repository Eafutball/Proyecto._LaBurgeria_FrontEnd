import React from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import { Box, Typography } from '@mui/material';

const Message = ({ message, type }) => {
    // Estilos según el tipo de mensaje
    const styles = {
        success: { backgroundColor: '#d4edda', color: '#155724' },
        error: { backgroundColor: '#f8d7da', color: '#721c24' },
        warning: { backgroundColor: '#fff3cd', color: '#856404' },
        info: { backgroundColor: '#cce5ff', color: '#004085' },
    };

    return (
        message && (
            <Box 
                sx={{ 
                    ...styles[type], 
                    padding: '16px', 
                    borderRadius: '4px', 
                    marginTop: '16px' 
                }}
            >
                <Typography variant="body2">{message}</Typography>
            </Box>
        )
    );
};

// Validación de propiedades
Message.propTypes = {
    message: PropTypes.string.isRequired, // 'message' debe ser una cadena
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired // 'type' debe ser uno de estos valores
};

export default Message;