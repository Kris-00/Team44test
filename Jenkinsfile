pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
        stage('OWASP DependencyCheck'){
            steps{
                echo 'OWASP DependencyCheck ...'
                dependencyCheck additionalArguments: '--format HTML --format XML --disableYarnAudit', odcInstallation: 'OWASP-Dependency-Check'
            }
        }
    }
}