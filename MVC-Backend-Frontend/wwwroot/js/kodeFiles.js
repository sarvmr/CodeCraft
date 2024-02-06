// const backendUrl = "https://codecraft.azurewebsites.net"; //<- change to actual db for deployment

const backendUrl ="http://localhost:5215";

//for making a new one in the db
const uploadDiv = async (name, kodeAsADiv) => {
    try {
        const data = {
            Name: name,
            Content: kodeAsADiv
        };

        const response = await fetch(backendUrl + '/file/uploadtext', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        
    } catch (e) {
        console.error(e);
    }
};

// for saving current work 
export const saveMyProject = async (name, kodeAsADiv) => {
    try {
        
        
        

        const data = {
            Name: name,
            Content: kodeAsADiv
        };

        

        const response = await fetch(backendUrl + '/file/savefile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Check if the response is not okay and handle the error
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorMessage}`);
        }

        const responseData = await response.json();
        
    } catch (e) {
        console.error(e);
    }
};



export const showMyProjects = async () => {
    try {
        const response = await fetch(backendUrl + '/file/showAllMyFiles');
        
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (e) {
        
    }
};

export const loadMyProject = async (myProject) => {
    try {
        const url = `${backendUrl}/file/loadAProject?projectName=${encodeURIComponent(myProject)}`;

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            

            const test2Container = document.getElementById("code-container");
            

            if (test2Container) {
                
                test2Container.outerHTML = data.projectContents;
                
                sessionStorage.setItem('projectName', myProject)
            } else {
                console.error('Element with id test2 not found.');
            }
            
            return data.projectContents;
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (e) {
        console.error(e);
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const openProjectListItem = document.getElementById('openProjectButton');
    const saveProjectButton = document.getElementById('saveProjectButton');
    const saveButton = document.getElementById('saveButton');

    if (openProjectListItem) {
        openProjectListItem.onclick = async (event) => {
            event.preventDefault();

            let dialog = document.getElementById('openDialog');
            dialog.showModal();

            
            let data = await showMyProjects();
            if (!data) {
                
                return;
            } else {
                let projectList = document.getElementById('openDialogList');
                projectList.innerHTML = '';

                for (let i = 0; i < data.projects.length; i++) {
                    let button = document.createElement('button');
                    button.className = 'openDialogListItem';
                    button.innerHTML = data.projects[i];

                    button.addEventListener('click', async () => {
                        await loadMyProject(data.projects[i]);
                        dialog.close();
                    });

                    projectList.appendChild(button);
                }
            }
        };
    }

    if (saveProjectButton) {
        saveProjectButton.onclick = async (event) => {
            event.preventDefault();
            let dialog = document.getElementById('saveDialog');
            dialog.showModal();
        };
    }

    saveButton.onclick = async (event) => {
        event.preventDefault();
        let name = document.getElementById('saveDialogInput').value;

        let kodeAsADiv = document.getElementById("code-container").outerHTML;
        

        await uploadDiv(name, kodeAsADiv);
        sessionStorage.setItem("projectName",name)
        let dialog = document.getElementById('saveDialog');
        dialog.close();
    }
});


