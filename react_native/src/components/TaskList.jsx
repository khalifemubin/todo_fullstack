import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Pressable, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, getTasks, updateTask } from '../actions/taskActions';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Spinner from 'react-native-loading-spinner-overlay';
import SelectDropdown from 'react-native-select-dropdown';
import { revertDateString } from '../utils/dateUtils';

/**
 * Stylesheet for swipe left action
 */
const leftSwipeStyle = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#ccffbd', justifyContent: 'center', height: 30, alignSelf: 'center',
    },
    text: {
        color: '#000',
        fontWeight: '600',
        padding: 5,
    },
});

/**
 * Stylesheet for swipe right action
 */
const rightSwipeStyle = StyleSheet.create({
    container: {
        backgroundColor: '#ff0000', justifyContent: 'center', height: 30, alignSelf: 'center',
    },
    text: {
        color: '#000',
        fontWeight: '600',
        padding: 5,
    },
});


/**
 *
 * @param {item}  Single item object of task collection
 * @param {deleteItem}  deleteItem function passed as props from main component
 * @param {editTask}  editTask function passed as props from main component
 * @param {markComplete}  markComplete function passed as props from main component
 * @returns Swipe control
 */
const ListItem = ({ item, deleteItem, editTask, markComplete }) => (
    <GestureHandlerRootView>
        <Swipeable
            renderLeftActions={() => LeftSwipeActions(item, editTask)}
            renderRightActions={() => RightSwipeActions(item, deleteItem)}
        >
            <Pressable onLongPress={() => markComplete(item)} style={[listStyle.itemContainer,
            (!item.completed && revertDateString(new Date(item.expiryDate)) < revertDateString(new Date())) ? listStyle.showExpire : (!item.completed && revertDateString(new Date(item.expiryDate)) === revertDateString(new Date())) ? listStyle.warnToday : '']}>
                {/* <View style={listStyle.itemContainer}> */}

                <Text style={[listStyle.textStyle, item.completed ? listStyle.strikeThrough : '']}>{item.title}{Number(!item.completed && revertDateString(new Date(item.expiryDate)) === revertDateString(new Date()))}</Text>
                <Text style={listStyle.tagsData}>{(item.tags.join(',').split(', ').length > 0) ? `Tags: ${item.tags.join(', ')}` : ''} </Text>
            </Pressable>
        </Swipeable>
    </GestureHandlerRootView>
);

/**
 *
 * @param {item}  Single item object of task collection
 * @param {editTask}  editTask function applied
 * @returns element on left swipe
 */
const LeftSwipeActions = (item, editTask) => {
    return (
        <View style={leftSwipeStyle.container}>
            <Text style={leftSwipeStyle.text} onPress={() => editTask(item)}>
                Edit
            </Text>
        </View>
    );
};

/**
 *
 * @param {item}  Single item object of task collection
 * @param {deleteItem}  deleteItem function applied
 * @returns element on right swipe
 */
const RightSwipeActions = (item, deleteItem) => {
    return (
        <View style={rightSwipeStyle.container}>
            <Text style={rightSwipeStyle.text} onPress={() => deleteItem(item)}>
                Delete
            </Text>
        </View>
    );
};

//Constant initialized for Status filter dropdown
const filterDropDown = ['Incomplete', 'Completed', 'All'];

/**
 *
 * @param {editTask} - Single item object of task collection passed from HomeScreen
 * @returns List element
 */
const TaskList = ({ editTask }) => {
    //Extract all tasks data from redux store
    const { tasks } = useSelector((state) => state.tasks);
    //Refresh state for Flatlist control
    const [refreshing, setRefereshing] = useState(false);
    //Loader for API calls
    const [spinner, setSpinner] = useState(false);
    //State for Status dropdown selection
    const [filterStatus, setFilterStatus] = useState(2);
    //Sate for filtering by Tags
    const [filterTags, setFilterTags] = useState('');

    //Init dispatch
    const dispatch = useDispatch();

    /**
     *
     * @param {obj} - item object to delete
     */
    const deleteItem = (obj) => {
        setSpinner(true);
        dispatch(deleteTask(obj._id));
        dispatch(getTasks());
        setSpinner(false);
    };

    /**
     *
     * @param {obj} - item object to mark complete on long press
     */
    const markComplete = (obj) => {
        setSpinner(true);
        dispatch(updateTask(obj._id, { completed: !obj.completed }));
        dispatch(getTasks());
        setTimeout(() => setSpinner(false), 2000);
    };

    useEffect(() => {
        setSpinner(true);
        dispatch(getTasks());
        setSpinner(false);
    }, [dispatch, tasks]);

    //REfresh list control
    const refreshData = () => {
        setRefereshing(true);
        dispatch(getTasks());
        setRefereshing(false);
    };

    /**
     *
     * @param {val} - To set filter state for tag
     */
    const changeFilterTags = (val) => {
        setFilterTags(val);
    };

    return (
        <View style={listStyle.listContainer}>
            {
                tasks?.length > 0 ?
                    <View>
                        <Spinner
                            visible={spinner}
                        />

                        <View style={listStyle.filter}>
                            <SelectDropdown
                                data={filterDropDown}
                                buttonStyle={listStyle.dropdownButton}
                                buttonTextStyle={listStyle.dropdownItem}
                                renderDropdownIcon={() => <Text style={listStyle.dropdownArrow}>^</Text>}
                                dropdownIconPosition="right"
                                defaultValue="All"
                                onSelect={(_, index) => {
                                    setFilterStatus(index);
                                }}
                            />
                            <TextInput
                                onChangeText={(val) => changeFilterTags(val)}
                                style={listStyle.filterTags}
                                placeholder="Search By Tag"
                                placeholderTextColor="#000"
                            />
                        </View>
                        <FlatList
                            data={tasks}
                            keyExtractor={(item) => item._id}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} colors={['#ff00ff']} />}
                            renderItem={({ item }) => (
                                (filterStatus === 2) ?
                                    (
                                        (filterTags.length > 0) ?
                                            ((item.tags.join(',').split(',').find(str => str.includes(filterTags))) ?

                                                <ListItem item={item} deleteItem={deleteItem} editTask={editTask}
                                                    markComplete={markComplete} />
                                                : null
                                            )
                                            :
                                            <ListItem item={item} deleteItem={deleteItem} editTask={editTask} markComplete={markComplete} />
                                    )
                                    :
                                    (
                                        (item.completed === Boolean(filterStatus)) ?
                                            (
                                                (filterTags.length > 0) ?
                                                    ((item.tags.join(',').split(',').find(str => str.includes(filterTags))) ?
                                                        <ListItem item={item} deleteItem={deleteItem} editTask={editTask}
                                                            markComplete={markComplete} />
                                                        : null)
                                                    :
                                                    <ListItem item={item} deleteItem={deleteItem} editTask={editTask}
                                                        markComplete={markComplete} />
                                            )
                                            : null
                                    )
                            )
                            }
                        />
                    </View>
                    :
                    <View style={listStyle.noData}>
                        <Text style={listStyle.noDataText}>No Tasks Found</Text>
                    </View>
            }
        </View>
    );
};

const listStyle = StyleSheet.create({
    listContainer: {
        marginTop: 15,
        flex: 1,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#dcdcdc',
        borderRadius: 5,
        padding: 15,
        margin: 15,
    },
    tagsData: {
        marginLeft: 'auto',
        fontStyle: 'italic',
        color: '#000',
    },
    textStyle: {
        fontSize: 15,
        color: '#000',
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap',
    },
    strikeThrough: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        fontWeight: 100,
    },
    filter: {
        flexDirection: 'row',
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#d5d5d9',
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        paddingVertical: 0,
        width: 140,
        height: 30,
    },
    dropdownItem: {
        color: 'red',
    },
    dropdownArrow: {
        transform: [{ rotate: '-180deg' }],
        color: '#000080',
    },
    filterTags: {
        flex: 1,
        marginLeft: 10,
        height: 30,
        fontSize: 14,
        padding: 0,
        paddingLeft: 5,
        backgroundColor: '#fff',
        color: '#000',
    },
    noData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 24,
    },
    showExpire: {
        backgroundColor: '#ff0000',
    },
    warnToday: {
        backgroundColor: '#ffff00',
    },
});

export default TaskList;
