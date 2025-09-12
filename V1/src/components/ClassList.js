import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ICPClient from '../api/icpClient';

// Styled components
const Container = styled.div`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ErrorContainer = styled.div`
    text-align: center;
    padding: 20px;
    color: #dc3545;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ClassCard = styled.div`
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
`;

const ClassHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
`;

const ClassName = styled.h3`
    margin: 0;
    color: #333;
    flex: 1;
`;

const ClassStatus = styled.div`
    color: ${props => props.color};
    font-weight: 500;
`;

const ClassSchedule = styled.div`
    margin-top: 10px;
    color: #666;
`;

const RegisterButton = styled.a`
    display: inline-block;
    padding: 8px 16px;
    margin-top: 10px;
    background: #1b7ecf;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
    transition: background-color 0.2s ease;

    &:hover {
        background: #1565c0;
    }
`;

const ClassList = ({ icpAccountName, locationId, programId }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const client = new ICPClient({
                    accountName: icpAccountName,
                    locationId,
                    programId
                });

                const classData = await client.getClasses();
                setClasses(classData);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch classes:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchClasses();
    }, [icpAccountName, locationId, programId]);

    if (loading) {
        return (
            <LoadingContainer>
                <div>Loading classes...</div>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <div>Unable to load classes</div>
                <div style={{ fontSize: '14px', marginTop: '10px' }}>{error}</div>
            </ErrorContainer>
        );
    }

    if (!classes.length) {
        return (
            <Container>
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No classes available at this time.
                </div>
            </Container>
        );
    }

    return (
        <Container>
            {classes.map(classItem => (
                <ClassCard key={classItem.id}>
                    <ClassHeader>
                        <ClassName>{classItem.name}</ClassName>
                        <ClassStatus color={classItem.status.color}>
                            {classItem.status.text}
                        </ClassStatus>
                    </ClassHeader>
                    <ClassSchedule>
                        <strong>{classItem.displaySchedule}</strong>
                    </ClassSchedule>
                    <RegisterButton 
                        href={classItem.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Class Details
                    </RegisterButton>
                </ClassCard>
            ))}
        </Container>
    );
};

export default ClassList; 