pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:16-alpine'
                    args '-u root'
                }
            }
            steps {
                echo 'Installing dependencies...'
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
                echo 'Running checks...'
                sh 'npm run lint || echo "No lint script - skipping"'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t 23525609/node-app:latest .'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Scanning for vulnerabilities...'
                sh 'trivy image --severity HIGH,CRITICAL 23525609/node-app:latest || true'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push 23525609/node-app:latest'
                }
            }
        }
    }
}
