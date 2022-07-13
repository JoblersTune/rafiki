variable project {
  type = string
}

variable env {
  type = string
}

variable name {
  type = string
}

variable zone {
  type = string
  default = "us-central1-b"
}

variable networking_mode {
  type = string
  default = "VPC_NATIVE"
}

variable enable_workload_identity {
  type = bool
  default = false
}

variable release_channel {
  type = string
  default = "REGULAR"
}

variable node_pools {
  type = list(object({
    name = string
    machine_type = string
    node_count = number
    min_node_count = number
    max_node_count = number
    max_surge = number
    max_unavailable = number
  }))
  default = [
    {
      name = "default"
      machine_type = "n2-standard-2"
      node_count = 1
      min_node_count = 0
      max_node_count = 8
      max_surge = 4
      max_unavailable = 0
    }
  ]
}

variable maintenance_schedule {
  type = object({
    start_time = string // e.g "03:00"
    end_time = string // e.g "03:00"
    recurrence = string // https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.5.3
  })
  default = {
    start_time = "2021-05-26T11:00:00.000Z"
    end_time = "2021-05-26T12:00:00.000Z"
    recurrence = "FREQ=WEEKLY;BYDAY=TU,WE,TH"
  }
}
