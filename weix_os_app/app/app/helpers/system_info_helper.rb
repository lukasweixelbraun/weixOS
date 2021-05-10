module SystemInfoHelper

  def self.cpu_usage
    file = File.join(Rails.root, 'system_info', 'cpu.txt')
    File.read(file)
  end

  def self.memory_usage
    file = File.join(Rails.root, 'system_info', 'memory.txt')
    File.read(file)
  end

  def self.temperature
    file = File.join(Rails.root, 'system_info', 'temp.txt')
    File.read(file)
  end

  def self.upgradables
    file = File.join(Rails.root, 'system_info', 'upgradable.txt')
    File.read(file)
  end
  
end
