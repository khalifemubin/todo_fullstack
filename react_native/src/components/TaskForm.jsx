import React, { useEffect, useState } from 'react';
import { Text, TextInput, StyleSheet, Modal, View, Pressable, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../actions/taskActions';
import DatePicker from 'react-native-date-picker';
import { revertDateObject } from '../utils/dateUtils';

/**
 * @param {showModal} - Whether to show this modal window
 * @param {setShowModal} - Set to show modal this window
 * @param {updateData} - Populate data for update
 * @returns Form
 */
const TaskForm = ({ showModal, setShowModal, updateData }) => {
    //State information for form fields
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        expiryDate: revertDateObject(new Date()),
    });

    //State information for DatePicker
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    useEffect(() => {
        //Check if this modal window is opened for update or adding new tqask
        if (Object.keys(updateData).length > 0) {
            // console.log("=====updateData=======");
            // console.log(updateData);
            // console.log("=====updateData=======");
            //populate form fields
            setFormData({ title: updateData[0].title, description: updateData[0].description, tags: updateData[0].tags.join(', '), expiryDate: new Date(updateData[0].expiryDate) });
        }
    }, [updateData]);

    //Init disptach
    const dispatch = useDispatch();

    //Extract form fields
    const { title, description, tags, expiryDate } = formData;

    const onChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    /**
     * function to show native Alert component
     * @params {title} - Title for Alert
     * @params {message} - Content body for Alert
     */
    const showAlert = (alertTitle, message) => {
        return (
            Alert.alert(
                alertTitle,
                message, [
                {
                    text: 'OK',
                },
            ]
            )
        );
    };

    /**
     * For both add and update
     * @returns dispatch action to update/add task
     * Hide this modal on success
     */
    const onSubmit = () => {
        try {
            //Validate fields begin
            if (title.trim().length === 0) {
                return (showAlert('Empty Title', 'Please enter title'));
            }

            if (description.trim().length === 0) {
                return (showAlert('Empty Description', 'Please enter description'));
            }
            //Validate fields begin

            //Dispatch based on add or update actions
            if (Object.keys(updateData).length > 0) {
                dispatch(updateTask(updateData[0]._id, formData));
            } else {
                dispatch(addTask(formData));
                setFormData({ title: '', description: '', tags: '', expiryDate: new Date() });
            }

            //Hide this modal window
            setShowModal(false);
        } catch (err) {
            return (showAlert('Operation Error', err.message));
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                setShowModal(!showModal);
            }}>
            <View style={modalStyle.centeredView}>
                <View style={modalStyle.modalView}>
                    <View>
                        <Text style={modalStyle.formLabel}>Title</Text>
                        <TextInput
                            onChangeText={(text) => onChange('title', text)}
                            value={title}
                            style={modalStyle.input}
                        />
                        <Text style={modalStyle.formLabel}>Description</Text>
                        <TextInput
                            onChangeText={(text) => onChange('description', text)}
                            value={description}
                            style={modalStyle.textArea}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <Text style={modalStyle.formLabel}>Tags (comma-separated)</Text>
                        <TextInput
                            onChangeText={(text) => onChange('tags', text)}
                            value={tags}
                            style={modalStyle.input}
                        />
                        <Text style={modalStyle.formLabel}>Expiry Date</Text>
                        <Text style={modalStyle.dateInput} onPress={() => setDatePickerOpen(true)}>{expiryDate.toDateString()}</Text>
                        <DatePicker
                            modal
                            open={datePickerOpen}
                            date={expiryDate}
                            mode="date"
                            minimumDate={revertDateObject(new Date())}
                            onConfirm={(selDate) => {
                                setDatePickerOpen(false);
                                onChange('expiryDate', selDate);
                            }}
                            onCancel={() => {
                                setDatePickerOpen(false);
                            }}
                        />
                        <Pressable style={modalStyle.button} onPress={onSubmit}>
                            <Text style={modalStyle.addButtonText}>{(Object.keys(updateData).length > 0) ? 'Update' : 'Add'} Task</Text>
                        </Pressable>
                        <Pressable style={modalStyle.cancelButton} onPress={() => setShowModal(false)}>
                            <Text style={modalStyle.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const modalStyle = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#00000099',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        marginTop: 22,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    formLabel: {
        color: '#000',
    },
    input: {
        color: '#000',
        backgroundColor: '#dcdcdc',
        borderRadius: 10,
        margin: 10,
    },
    textArea: {
        color: '#000',
        backgroundColor: '#dcdcdc',
        borderRadius: 10,
        margin: 10,
        textAlignVertical: 'top',
    },
    button: {
        margin: 15,
        marginTop: 15,
        borderRadius: 5,
        height: 45,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    cancelButton: {
        margin: 15,
        marginTop: 15,
        borderRadius: 5,
        height: 45,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateInput: {
        color: '#000',
        backgroundColor: '#dcdcdc',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
});

export default TaskForm;
