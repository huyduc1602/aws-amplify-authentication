import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, TextInput } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { createTodo } from '../graphql/mutations';
import { listTodos } from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';

const { width } = Dimensions.get('window');

const Home = () => {
    // retrieves only the current value of 'user' from 'useAuthenticator'
    const userSelector = (context: any) => [context.user];
    const { user, signOut } = useAuthenticator(userSelector);
    const initialState = { name: '', description: '' };
    const client = generateClient();

    const [formState, setFormState] = useState(initialState);
    const [todos, setTodos] = useState<any[]>([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    function setInput(key: string, value: string) {
        setFormState({ ...formState, [key]: value });
    }

    async function fetchTodos() {
        try {
            const todoData = await client.graphql({
                query: listTodos
            });
            const todos = todoData.data.listTodos.items;
            setTodos(todos);
        } catch (err) {
            console.log('error fetching todos');
        }
    }

    async function addTodo() {
        try {
            if (!formState.name || !formState.description) return;
            const todo = { ...formState };
            setTodos([...todos, todo]);
            setFormState(initialState);
            await client.graphql({
                query: createTodo,
                variables: {
                    input: todo
                }
            });
        } catch (err) {
            console.log('error creating todo:', err);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Welcome {user.signInDetails?.loginId}!</Text>
                <Pressable style={styles.button} onPress={() => signOut()}>
                    <Text style={styles.buttonSignOut}>Sign out</Text>
                </Pressable>
            </View>
            <View style={styles.container}>
                <TextInput
                    onChangeText={(value) => setInput('name', value)}
                    style={styles.input}
                    value={formState.name}
                    placeholder="Name"
                />
                <TextInput
                    onChangeText={(value) => setInput('description', value)}
                    style={styles.input}
                    value={formState.description}
                    placeholder="Description"
                />
                <Pressable onPress={addTodo} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Create todo</Text>
                </Pressable>
                {todos.map((todo, index) => (
                    <View key={todo.id ? todo.id : index} style={styles.todo}>
                        <Text style={styles.todoName}>{todo.name}</Text>
                        <Text style={styles.todoDescription}>{todo.description}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    header: {
        display: 'flex',
        padding: 20,
        width: width,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 50,
        backgroundColor: '#B00020',
        padding: 10,
        borderRadius: 6,
    },
    buttonSignOut: {
        color: '#fff',
        fontSize: 18,
    },
    todo: { marginBottom: 15 },
    input: {
        backgroundColor: '#ddd',
        marginBottom: 10,
        padding: 8,
        fontSize: 18,
        width: '100%'
    },
    todoName: { fontSize: 20, fontWeight: 'bold' },
    todoDescription: { fontSize: 16 },
    buttonContainer: {
        alignSelf: 'center',
        backgroundColor: 'black',
        paddingHorizontal: 8
    },
    buttonText: { color: 'white', padding: 16, fontSize: 18 }
});

export default Home;