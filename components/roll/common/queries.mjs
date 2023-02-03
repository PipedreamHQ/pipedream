export default {
  addCompany: `
    mutation createCompany(
        $name: String
        $status: String
        $invoiceFirstName: String
        $invoiceLastName: String
        $phone: String
        $mobile: String
        $email: String
        $website: String
        $address: String
        $address2: String
        $cityOrTown: String
        $stateOrRegion: String
        $zipOrPostcode: String
        $country: String
    ) {
        addCompany(
            CompanyName: $name
            CompanyStatus: $status
            CompanyInvoiceFirstName: $invoiceFirstName
            CompanyInvoiceLastName: $invoiceLastName
            CompanyPhone: $phone
            CompanyMobile: $mobile
            CompanyEmail: $email
            CompanyWebsite: $website
            CompanyAddress: $address
            CompanyAddress2: $address2
            CompanyCityOrTown: $cityOrTown
            CompanyStateOrRegion: $stateOrRegion
            CompanyZipOrPostcode: $zipOrPostcode
            CompanyCountry: $country
        ) {
            CompanyId
        }
    }`,
  addProject: `
      mutation createProject(
          $companyId: Int
          $title: String
          $description: String
          $status: String
          $subStatusId: String
          $color: String
          $jobNumber: String
          $projectAtRisk: Int
          $projectType: String
          $projectLeadSourceId: Int
          $value: Float
          $dueDate: Date
          $startDate: Date
          $lastDate: Date
      ) {
          addProject(
              CompanyId: $companyId,
              ProjectTitle: $title,
              ProjectDescription: $description,
              ProjectStatus: $status,
              ProjectSubStatusId: $subStatusId,
              ProjectColor: $color,
              ProjectJobNumber: $jobNumber,
              ProjectAtRisk: $projectAtRisk,
              ProjectType: $projectType,
              ProjectLeadSourceId: $projectLeadSourceId,
              ProjectValue: $value,
              DueDate: $dueDate,
              ProjectStartDate: $startDate,
              ProjectEndDate: $lastDate,
          ) {
            ProjectId
          }
      }`,
  addTime: `
        mutation createTime(
            $employee: Int
            $projectId: Int
            $paymentId: Int
            $taskId: Int
            $rateId: Int
            $rateValue: Float
            $timeText: String
            $timeInSeconds: Int
            $loggedForDate: Date
            $timeStatus: String
        ) {
            addTime(
                EmployeeId: $employee
                ProjectId: $projectId
                PaymentId: $paymentId
                TaskId: $taskId
                RateId: $rateId
                RateValue: $rateValue
                TimeText: $timeText
                TimeInSeconds: $timeInSeconds
                LoggedForDate: $loggedForDate
                TimeStatus: $timeStatus
            ) {
                TimeId
            }
        }`,
  listCompanies: `
          query listCompanies(
              $companyId: Int
              $name: String
              $email: String
              $status: String
              $order: String
              $limit: Int
              $offset: Int
          ) {
              company (
                  CompanyId: $companyId
                  CompanyName: $name
                  CompanyEmail: $email
                  CompanyStatus: $status
                  order: $order
                  limit: $limit
                  offset: $offset
              ) {
              CompanyId
              CompanyName
              CompanyStatus
              CompanyInvoiceFirstName
              CompanyInvoiceLastName
              CompanyPhone
              CompanyPhoneArea
              CompanyPhoneCountry
              CompanyMobile
              CompanyEmail
              CompanyWebsite
              CompanyAddress
              CompanyAddress2
              CompanyCityOrTown
              CompanyStateOrRegion
              CompanyZipOrPostcode
              CompanyCountry
              }
          }`,
  listProjects: `
            query listProjects(
                $projectId: Int
                $companyId: Int
                $title: String
                $description: String
                $projectType: String
                $projectLeadSourceId: Int
                $status: String
                $subStatusId: String
                $color: String
                $value: Float
                $jobNumber: String
                $projectAtRisk: Int
                $dueDate: DateTime
                $startDate: DateTime
                $endDate: DateTime
                $order: String
                $limit: Int
                $offset: Int
            ) {
                project (
                    ProjectId: $projectId
                    CompanyId: $companyId
                    ProjectTitle: $title
                    ProjectDescription: $description
                    ProjectType: $projectType
                    ProjectLeadSourceId: $projectLeadSourceId
                    ProjectStatus: $status
                    ProjectSubStatusId: $subStatusId
                    ProjectColor: $color
                    ProjectValue: $value
                    ProjectJobNumber: $jobNumber
                    ProjectAtRisk: $projectAtRisk
                    DueDate: $dueDate
                    ProjectStartDate: $startDate
                    ProjectEndDate: $endDate
                    order: $order
                    limit: $limit
                    offset: $offset
                ) {
                    ProjectId
                    CompanyId
                    ProjectTitle
                    ProjectDescription
                    ProjectType
                    ProjectLeadSourceId
                    ProjectStatus
                    ProjectSubStatusId
                    ProjectValue
                    ProjectJobNumber
                    PONum
                    ProjectAtRisk
                    ProjectIsRetainer
                    ProjectRetainerFrequency
                    ProjectRetainerPeriod
                    ProjectColor
                    ProjectRetainerStartDate
                    CompletedDate
                    DueDate
                    ProjectStartDate
                    ProjectEndDate
                    CostOrChargeout
                    ProjectOrder
                    Created
                    LastUpdated
                }
            }`,
  listEmployees: `
            query {
                employee {
                  EmployeeId
                  EmployeeName
                  EmployeeEmail
                  CustomerId
                }
              }`,
  listPayments: `
            query listPayments (
                $projectId: Int
            ) {
                payment(
                    ProjectId: $projectId
                ) {
                  PaymentId
                  Description
                }
            }`,
  listLeadSources: `
              query {
                projectLeadSource {
                  ProjectLeadSourceId
                  ProjectLeadSource
                  ProjectLeadSourceStatus
                }
              }`,
  listStatuses: `
              query listStatuses (
                $parentId: Int
              ) {
                status(
                    ParentId: $parentId
                ) {
                  Id,
                  Slug,
                  Status
                }
              }`,
  listTypes: `
              query {
                projectType {
                  ProjectTypeId
                  ProjectType
                  ProjectTypeIdStatus
                }
              }`,
  listRates: `
              query {
                rate {
                  RateId
                  RateTitle
                }
              }`,
  listChecklists: `
              query listChecklists (
                $projectId: Int
              ) {
                checklist (
                    ProjectId: $projectId
                ) {
                  ChecklistId
                }
              }`,
  listTasks: `
              query listTasks (
                $checklistId: Int
                $order: String
                $limit: Int
                $offset: Int
              ) {
                task (
                    ChecklistId: $checklistId
                    order: $order
                    limit: $limit
                    offset: $offset
                ) {
                  TaskId
                  TaskText
                }
              }`,
  listTimes: `
              query listTimes (
                $order: String
                $limit: Int
                $offset: Int
              ) {
                time (
                    order: $order
                    limit: $limit
                    offset: $offset
                ) {
                  TimeId
                  EmployeeId
                  ProjectId
                  PaymentId
                  TaskId
                  RateId
                  RateValue
                  TimeText
                  TimeInSeconds
                  LoggedForDate
                  TimeStatus
                  Created
                  LastUpdated
                }
              }`,
};
