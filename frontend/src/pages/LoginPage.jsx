import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import AuthForm from '../components/AuthForm';

export default function LoginPage() {
    const { login, navigate } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (!success) {
            setError('Invalid email or password.');
        }
    };

    return (
        <AuthForm
            title="Login"
            onSubmit={handleSubmit}
            fields={[
                { label: 'Email', type: 'email', value: email, onChange: (e) => setEmail(e.target.value) },
                { label: 'Password', type: 'password', value: password, onChange: (e) => setPassword(e.target.value) },
            ]}
            buttonText="Login"
            error={error}
            footerText="Don't have an account?"
            footerLinkText="Register here"
            onFooterLinkClick={() => navigate('register')}
        />
    );
}