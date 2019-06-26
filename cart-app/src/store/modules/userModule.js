import services from '../../services/axiosService';

export const userModule ={
    state : {
        users : {},
        loggedUser : null,
    },
    mutations : {
        setLoggedUser: (state,param) => {
            state.loggedUser = param;
        },
        setUsers: (state, param) =>{
            state.users = param;
        },
        setLoggedStatus: (state,param) => {
            state.loggedInFlag = param;
        },
    },
    getters : {
        getUsers : state => {
            return state.users;
        },
        getLoggedUser : state => {
            return state.loggedUser;
        },
    },
    actions : {
        setUsers:({commit},param) =>{
            return new Promise((resolve,reject) =>{
                new services().fetchData({method : param.method, url : param.url})
                .then(function(result) { 
                     commit('setUsers',result.data.users);
                     resolve()
                 }, function(errorMessage) { 
                     console.log(errorMessage)
                 }) 
            })
        },
        setLoggedUser:({commit},param)=>{
            commit('setLoggedUser',param);
        }
    }
}