import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getSingleTask, getTasks } from '../actions/taskActions';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/authActions';
import RBSheet from 'react-native-raw-bottom-sheet';
import InfoIcon from '../assets/img/information-icon.jpeg';

/**
 *
 * @param {setLogout} - To make user logout, on click of the said button
 * @returns
 */
const HomeScreen = ({ setLogout }) => {
    //Init reference to used for Bottom Sheet to show information
    const refRBSheet = useRef();
    //State to store whether to show modal window or not
    const [showModal, setShowModal] = useState(false);
    //State to store data for update
    const [updateData, setUpdateDate] = useState({});
    //State to enquire from redux store to check if backend server is down or not
    const serverDown = useSelector((state) => state.tasks.serverDown);
    //Initialize dispatch
    const dispatch = useDispatch();
    //turn raw iamge into resource uri
    const INFO_ICON = Image.resolveAssetSource(InfoIcon).uri;

    //On click of logout button
    const signOff = async () => {
        dispatch(logout());
        setLogout(true);
    };

    //When add task button is clicked
    const addTask = () => {
        setShowModal(true);
        setUpdateDate({});
    };

    /**
     *
     * @param {obj} - Object of single task
     */
    const editTask = async (obj) => {
        const editInfo = await getSingleTask(obj._id);
        //set data
        setUpdateDate(editInfo);
        //Open modal for editing
        setShowModal(true);
    };

    //Called Check Again button is click
    const checkBackend = () => {
        dispatch(getTasks());
    };

    return (
        // If server is not down then show the list
        !serverDown ?
            <View style={parentStyle.body}>
                <View style={parentStyle.topBar}>
                    <Pressable onPress={addTask}>
                        <Text style={parentStyle.ctaText}>Add Task</Text>
                    </Pressable>
                    <Pressable style={parentStyle.infoIconContainer} onPress={() => refRBSheet.current.open()}>
                        <Image
                            width={30}
                            height={30}
                            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
                            source={{ uri: INFO_ICON }}
                        />
                    </Pressable>
                    <TouchableOpacity>
                        <Pressable onPress={signOff}>
                            <Text style={parentStyle.ctaText}>Logout</Text>
                        </Pressable>
                    </TouchableOpacity>
                </View>
                <View style={parentStyle.horizontalLine} />
                {/* <Text style={parentStyle.pageTitle}>Task List</Text>
                <View style={parentStyle.horizontalLine} /> */}
                <TaskList editTask={editTask} />
                <TaskForm showModal={showModal} setShowModal={setShowModal} updateData={updateData} />

                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'transparent',
                        },
                        draggableIcon: {
                            backgroundColor: '#fff',
                        },
                        container: {
                            backgroundColor: 'black',
                            padding: 15,
                        },
                    }}
                    height={300}
                >
                    <Text style={sheetStyle.instructionsText}>* To update any task, swipe left</Text>
                    <Text style={sheetStyle.instructionsText}>* To delete any task, swipe right</Text>
                    <Text style={sheetStyle.instructionsText}>* To toggle complete/incomplete long press the task</Text>
                    <Text style={sheetStyle.instructionsText}>* Drag from the top of the list to refresh</Text>
                    <Text style={[sheetStyle.instructionsText, sheetStyle.expiryWarnInstruction]}>* If task expiry  is today, then listed item would be highlighted in yellow</Text>
                    <Text style={[sheetStyle.instructionsText, sheetStyle.expiryErrorInstruction]}>* If task is expired, then listed item would be highlighted in red</Text>
                </RBSheet>
            </View>
            :
            // If server is down then show the message
            <View style={parentStyle.serverDown}>
                <Text style={parentStyle.serverDownText}>Sorry! But it seems the server is down. Please try again later</Text>
                <Text style={parentStyle.checkBackedCta} onPress={checkBackend}>Check Again</Text>
            </View>
    );
};

const parentStyle = StyleSheet.create({
    body: {
        paddingTop: 15,
        paddingLeft: 25,
        paddingRight: 25,
        flex: 1,
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    horizontalLine: {
        borderBottomColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    ctaText: {
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 10,
        padding: 4,
    },
    pageTitle: {
        fontSize: 16,
        alignSelf: 'center',
    },
    serverDown: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    serverDownText: {
        fontSize: 24,
    },
    checkBackedCta: {
        backgroundColor: '#f2f2f2',
        color: '#000',
        marginTop: 20,
        padding: 5,
    },
});

const sheetStyle = StyleSheet.create({
    instructionsText: {
        fontSize: 14,
        color: '#fff',
        margin: 5,
    },
    expiryWarnInstruction: {
        color: '#ffff00',
    },
    expiryErrorInstruction: {
        color: '#ff0000',
    },
});

export default HomeScreen;
