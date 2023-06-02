pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh """
                    docker build --rm \
                    -f Dockerfile \
                    -t registry.hub.docker.com/patna/front \
                    -t registry.hub.docker.com/patna/front \
                    .
                """
            }
        }
        

        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'patna-docker', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                sh """
						docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD registry.hub.docker.com
                		docker push registry.hub.docker.com/patna/front
					  """
                }
            }
        }

        stage('Deploy to server') {
            steps {
                script {
                    sshagent (credentials: ["DEV-Server"]){
                        sh """
                            ssh -o StrictHostKeyChecking=no -l ubuntu 13.229.66.4 'mkdir -p patna/front/'
                            scp docker-compose.yaml ubuntu@13.229.66.4:patna/front/

                            ssh -o StrictHostKeyChecking=no -l ubuntu 13.229.66.4 \"
                                docker compose -f docker-compose.yaml down
                                docker image rm -f patna/front
                                cd patna/front/
                                docker compose -f docker-compose.yaml up -d
                            \"
                        """
                    }
                }
            }
        }
    }
}

