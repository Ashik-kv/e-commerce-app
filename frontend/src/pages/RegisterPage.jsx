import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import AuthForm from '../components/AuthForm';

export default function RegisterPage() {
    const { register, navigate } = useContext(AppContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register({ firstName, lastName, email, password });
        if (!result.success) {
            setError(result.error || 'An account with this email may already exist.');
        } else {
            alert('Registration successful! Please log in.');
            navigate('login');
        }
    };

    return (
        <AuthForm
            title="Create an Account"
            onSubmit={handleSubmit}
            fields={[
                { label: 'First Name', type: 'text', value: firstName, onChange: (e) => setFirstName(e.target.value) },
                { label: 'Last Name', type: 'text', value: lastName, onChange: (e) => setLastName(e.target.value) },
                { label: 'Email', type: 'email', value: email, onChange: (e) => setEmail(e.target.value) },
                { label: 'Password (min 8 characters)', type: 'password', value: password, onChange: (e) => setPassword(e.target.value) },
            ]}
            buttonText="Register"
            error={error}
            footerText="Already have an account?"
            footerLinkText="Login here"
            onFooterLinkClick={() => navigate('login')}
        />
    );
}