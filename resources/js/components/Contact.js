import { Banner, Button, Form, FormLayout, LegacyCard, Page, TextField } from '@shopify/polaris';
import React, { useState, useCallback, useEffect} from 'react';

import callapi from './CallApi';


const Contact = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        subject: '',
        content: '',
    });
    
    const handleNameChange = useCallback((value) => setValues(prevValues => ({ ...prevValues, name: value })), []);
    const handleEmailChange = useCallback((value) => setValues(prevValues => ({ ...prevValues, email: value })), []);
    const handleSubjectChange = useCallback((value) => setValues(prevValues => ({ ...prevValues, subject: value })), []);
    const handleContentChange = useCallback((value) => setValues(prevValues => ({ ...prevValues, content: value })), []);

    const [status, setStatus] = useState(null);
    

    const handleSubmit = () => {
        const data = {
            name: values.name,
            email: values.email,
            subject: values.subject,
            content: values.content
        };

        callapi(window.App.appUrl + '/api/sendEmail', data)
            .then((response) => {
                console.log(response);
                setValues({
                    name: '',
                    email: '',
                    subject: '',
                    content: '',
                });
                setStatus('success');
            })
            .catch(error => {
                console.log('failed...', error);
                setStatus('error');
            });
    };
    useEffect(() => {
        if(status === 'success') {
          setTimeout(() => {
            setStatus('');
          }, 3000);
        }
      }, [status]);
    

    const renderBanner = () => {
        if (status === 'success') {
            return (
                <Banner status="success">
                    <p>Thanks for contacting us! We will reply back to you at your email within 12 hours. Please make sure you have created a staff account for us. It will help us support you quickly.</p>
                </Banner>
            );
        } else if (status === 'error') {
            return (
                <Banner status="critical">
                    <p>System error, please resend later!</p>
                </Banner>
            );
        }
        return null;
    };

    return (
        <div id="page-contact">
            <Page title="Contact us">
                <LegacyCard>
                    <LegacyCard.Section>
                        <p>Don't hesitate to contact us if you face any problem or have any question about the app. We are happy to help you.
                            Please give us permission to access your Shopify Admin. So we could support you quickly.
                            We need to access Apps and Online Store {'>'} Themes. Our email address for creating staff account</p>
                    </LegacyCard.Section>
                    {status && renderBanner()}
                    <LegacyCard.Section>
                        <Form onSubmit={handleSubmit}>
                            <FormLayout>
                                <FormLayout.Group>
                                    <TextField
                                        type="text" label="Your name (*)" value={values.name} onChange={handleNameChange}
                                        autoComplete="name"
                                    />
                                    <TextField
                                        type="email" label="Your email (*)" value={values.email} onChange={handleEmailChange}
                                        autoComplete="email"
                                    />
                                </FormLayout.Group>
                                <TextField
                                    type="text" label="Subject (*)" value={values.subject} onChange={handleSubjectChange}
                                    autoComplete="off"
                                />
                                <TextField
                                    type="text" label="Content (*)" value={values.content} onChange={handleContentChange}
                                    autoComplete="off" multiline={4}
                                />
                                <Button primary submit disabled={values.name === "" || values.email === "" || values.subject === "" || values.content === ""} >
                                    Send
                                </Button>
                            </FormLayout>
                        </Form>
                    </LegacyCard.Section>
                </LegacyCard>
            </Page>
        </div>
    );
};

export default Contact;
