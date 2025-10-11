import React from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './layout/MainLayout';
import './App.css'; // Keep original App.css if it has styles for your layout

export default function App() {
    return (
        <AppProvider>
            <MainLayout />
        </AppProvider>
    );
}