pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:16-alpine'
                    args '-u root'
                }
            }

            steps {
                echo 'Installing application dependencies...'
                sh 'npm install'
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:16-alpine'
                    args '-u root'
                }
            }

            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t node-app:${BUILD_NUMBER} .'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Scanning application dependencies...'

                sh '''
                    trivy fs \
                    --scanners vuln \
                    --severity HIGH,CRITICAL \
                    --format table \
                    --output trivy-report.txt \
                    .
                '''

                sh '''
                    trivy fs \
                    --scanners vuln \
                    --exit-code 1 \
                    --severity HIGH,CRITICAL \
                    .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'

                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login \
                        -u "$DOCKER_USER" \
                        --password-stdin

                        docker tag node-app:${BUILD_NUMBER} "$DOCKER_USER/node-app:${BUILD_NUMBER}"
                        docker tag node-app:${BUILD_NUMBER} "$DOCKER_USER/node-app:latest"

                        docker push "$DOCKER_USER/node-app:${BUILD_NUMBER}"
                        docker push "$DOCKER_USER/node-app:latest"
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-report.txt',
                             allowEmptyArchive: true,
                             fingerprint: true
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
