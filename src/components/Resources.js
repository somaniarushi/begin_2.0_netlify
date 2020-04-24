import React from "react";
import { StaticQuery, graphql } from 'gatsby';
import utils from "../utils";
import _ from 'lodash';

class Resources extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            searchVal: "",
            resources: {},
            currentQuery: {},
            queryWasUpdated: false,
            possTypes: [
                "Events",
                "Mentoring",
                "Funding & Grants",
                "Education & Awareness",
                "Networks",
                "Student Groups",
                "Competitions",
                "Fellowships & Scholarships",
                "Courses",
                "Investors for Equity, VCs",
                "Training & Support",
                "Crowdfunding",
                "Job & Internship"
            ],
            possAudiences: [
                "Undergraduate Student",
                "Graduate Student",
                "Faculty",
                "Staff",
                "Alumni",
                "Recent Alumni",
                "Everyone",
                "Women",
                "Investors",
                "Non-profit",
                "For-profit"
            ]
        }

    }

    /**
     * Makes a call to props.getQuery upon the component mounting for the initial population of the directory.
     */
    componentDidMount = () => {
        this.setState({ resources: utils.queryResources(this.state.currentQuery, this.props.resources) });
    }
    
    componentDidUpdate = () => {
        if (this.state.queryWasUpdated) {
            this.setState({ resources: utils.queryResources(this.state.currentQuery, this.props.resources), queryWasUpdated: false });
        }
    }

    /**
     * Toggles a resource attribute filter. Mutates state directly to make use of the Set, and as such
     * calls setState on an indicator variable.
     * @param {String} attribute - The name of the resource attribute this filter pertains to, e.g. "types", "location"
     * @param {String} value - The value you want to set the given attribute to in your filter.
     * 
     */
    handleToggle = (attribute, value) => (() => {
        const newQuery = _.cloneDeep(this.state.currentQuery);
        if (this.state.currentQuery.hasOwnProperty(attribute) && this.state.currentQuery[attribute].includes(value)) {
            newQuery[attribute] = newQuery[attribute].filter(val => (val !== value));
            if (newQuery[attribute].length === 0) {
                delete newQuery[attribute];
            }
            document.getElementById(`${value}-toggle`).classList.remove("active");
        } else {
            newQuery[attribute] = newQuery[attribute] ?? [];
            newQuery[attribute].push(value);
            document.getElementById(`${value}-toggle`).classList.add("active");
        }

        this.setState({ currentQuery: newQuery, queryWasUpdated: true });
    })

    /**
     * Expands a resource card's description.
     */
    expandResource = (index) => (() => {
        document.getElementById(`resource-${index}`).classList.add("expanded");
    })
    
    /**
     * Contracts a resource card's description.
     */
    contractResource = (index) => (() => {
        document.getElementById(`resource-${index}`).classList.remove("expanded");
    })

    render() {
        return (
            <div className={"directory"}>
                <div className={"directory-control"}>
                    <h3 className={"directory-control-heading"}>Types</h3>
                    <div className={"directory-control-types"}>
                        {this.state.possTypes.map((type, index) => (
                            <button className={"begin-button filter-toggle"} id={`${type}-toggle`} onClick={this.handleToggle("types", type)} key={index}>{type}</button>
                        ))}
                    </div>
                    <h3 className={"directory-control-heading"}>Audiences</h3>
                    <div className={"directory-control-types"}>
                        {this.state.possAudiences.map((audience, index) => (
                            <button className={"begin-button filter-toggle"} id={`${audience}-toggle`} onClick={this.handleToggle("audiences", audience)} key={index}>{audience}</button>
                        ))}
                    </div>
                </div>
                <div className={"resources"}>
                    {Object.keys(this.state.resources).map((resourceId, index) => {
                        const resource = this.state.resources[resourceId];
                        return (
                            <div key={index} id={`resource-${index}`} className={"resource"}>
                                <div className={"resource-title"}>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                                </div>
                                <p className={"resource-description"}>{resource.desc}</p>
                                <p className={"ellipsis"}>...</p>
                                <button className={"begin-button resource-expand"} onClick={this.expandResource(index)}>Show More</button>
                                <button className={"begin-button resource-contract"} onClick={this.contractResource(index)}>Show Less</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
    
}

// Resources.propTypes = {
//     data: PropTypes.shape({
//       allMarkdownRemark: PropTypes.shape({
//         edges: PropTypes.array,
//       }),
//     }),
//   }

export default () => (
    <StaticQuery
        query={graphql`
        query {
        allResourcesJson {
            edges {
            node {
                id
                title
                desc
                url
                types {
                val
                }
                audiences {
                val
                }
            }
            }
        }
        }
    `}
        render={(data, count) => <Resources resources={utils.formatResourceQuery(data, "allResourcesJson")} count={count} />}
    />
)
  