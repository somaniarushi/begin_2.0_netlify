import axios from 'axios';
import _ from 'lodash';
import config from "./config";

/**
 * Runs a GET against the backend at the provided endpoint and with the provided query parameters.
 * @param {String} endpoint - The backend route to hit.
 * @param {JSON} state - The state of the component calling this method.
 * @param {Array} params - An array of query parameter keys to read off of the state.
 * @param {Array} delim - A delimiter to use when assigning multiple values to a query parameter.
 * @returns {Array} Array of JSON objects representing the resources to display (writes this into the state).
 */
const getRequest = async (endpoint, state, params, delim) => {
    let query = {};
    params.forEach(param => {
        query[param] = "";
        state[param].forEach(value => { query[param] += `${value}${delim}` })
    });
    const response = await axios.post(`${config.development.backend}/${endpoint}`, query);
    console.log(response.data);
    return response.data;
}

const queryResources = (query, resources) => {
    const queryResult = _.cloneDeep(resources);
    Object.keys(query).forEach(queryKey => {
        const queryValue = query[queryKey];
        let toDelete = [];
        Object.keys(resources).forEach(resourceId => {
            const resource = resources[resourceId];
            if (resource.hasOwnProperty(queryKey)) {
                if (Array.isArray(resource[queryKey])) {
                    if (_.intersection(resource[queryKey], queryValue).length <= 0) {
                        toDelete.push(resourceId);
                    } 
                } else {
                    if (resource[queryKey] !== queryValue) {
                        toDelete.push(resourceId);
                    }
                }
            } 
        })

        toDelete.forEach(resourceId => {
            delete queryResult[resourceId];
        })
    })
    return queryResult;
}

const formatResourceQuery = (resourceQuery, fieldName) => {
    const data = resourceQuery[fieldName];
    const formatted = {};
    data.edges.forEach(edge => {
        const { node } = edge;
        formatted[node.id] = _.cloneDeep(node);
        Object.keys(node).forEach(attribute => {
            if (Array.isArray(node[attribute])) {
                formatted[node.id][attribute] = [];
                node[attribute].forEach(item => {
                    formatted[node.id][attribute].push(item.val);
                })
            }
        })
    })
    return formatted;
}

export default {
    getRequest, formatResourceQuery, queryResources
}