pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t enosh0606/node-app:latest .'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Scanning for vulnerabilities...'
                sh 'trivy image enosh0606/node-app:latest'
            }
        }

        stage('Push') {
            steps {
                echo 'Pushing to Docker Hub...'
                sh 'docker push enosh0606/node-app:latest'
            }
        }
    }
}
