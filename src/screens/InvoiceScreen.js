import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';

export default function InvoiceScreen({onNavigate, navigation}) {
  const [activeTab, setActiveTab] = useState('create');
  const [searchQuery, setSearchQuery] = useState('');

  const mockInvoices = [
    {
      id: 'INV-001',
      jobId: 'JOB-001',
      customer: 'David Thompson',
      amount: 2500.0,
      status: 'paid',
      date: '2024-01-20',
      dueDate: '2024-02-20',
    },
    {
      id: 'INV-002',
      jobId: 'JOB-002',
      customer: 'TechCorp Office',
      amount: 1800.0,
      status: 'pending',
      date: '2024-01-22',
      dueDate: '2024-02-22',
    },
    {
      id: 'INV-003',
      jobId: 'JOB-003',
      customer: 'Metro Hospital',
      amount: 3200.0,
      status: 'overdue',
      date: '2024-01-15',
      dueDate: '2024-02-15',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'overdue':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const filteredInvoices = mockInvoices.filter(
    invoice =>
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.jobId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderInvoiceItem = ({item}) => (
    <TouchableOpacity style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View>
          <Text style={styles.invoiceId}>{item.id}</Text>
          <Text style={styles.jobId}>Job: {item.jobId}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.customerName}>{item.customer}</Text>
      <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>

      <View style={styles.invoiceDates}>
        <Text style={styles.dateText}>
          Issued: {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.dateText}>
          Due: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.invoiceActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>👁️ View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📧 Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📄 PDF</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const CreateInvoiceForm = () => {
    const [invoiceData, setInvoiceData] = useState({
      jobId: '',
      customerName: '',
      customerEmail: '',
      items: [{description: '', quantity: '', rate: '', amount: ''}],
      notes: '',
    });

    const addItem = () => {
      setInvoiceData({
        ...invoiceData,
        items: [
          ...invoiceData.items,
          {description: '', quantity: '', rate: '', amount: ''},
        ],
      });
    };

    const removeItem = index => {
      const newItems = invoiceData.items.filter((_, i) => i !== index);
      setInvoiceData({...invoiceData, items: newItems});
    };

    const updateItem = (index, field, value) => {
      const newItems = [...invoiceData.items];
      newItems[index] = {...newItems[index], [field]: value};

      // Auto-calculate amount
      if (field === 'quantity' || field === 'rate') {
        const quantity = parseFloat(newItems[index].quantity) || 0;
        const rate = parseFloat(newItems[index].rate) || 0;
        newItems[index].amount = (quantity * rate).toFixed(2);
      }

      setInvoiceData({...invoiceData, items: newItems});
    };

    const calculateTotal = () => {
      return invoiceData.items
        .reduce((total, item) => {
          return total + (parseFloat(item.amount) || 0);
        }, 0)
        .toFixed(2);
    };

    const handleCreateInvoice = () => {
      if (!invoiceData.jobId || !invoiceData.customerName) {
        Alert.alert('Error', 'Please fill in required fields');
        return;
      }

      Alert.alert(
        'Create Invoice',
        `Create invoice for ${invoiceData.customerName}?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Create',
            onPress: () => {
              Alert.alert('Success', 'Invoice created successfully!');
              // Reset form
              setInvoiceData({
                jobId: '',
                customerName: '',
                customerEmail: '',
                items: [{description: '', quantity: '', rate: '', amount: ''}],
                notes: '',
              });
            },
          },
        ],
      );
    };

    return (
      <ScrollView style={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Job ID *</Text>
            <TextInput
              style={styles.input}
              value={invoiceData.jobId}
              onChangeText={text =>
                setInvoiceData({...invoiceData, jobId: text})
              }
              placeholder="Enter job ID"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              value={invoiceData.customerName}
              onChangeText={text =>
                setInvoiceData({...invoiceData, customerName: text})
              }
              placeholder="Enter customer name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Email</Text>
            <TextInput
              style={styles.input}
              value={invoiceData.customerEmail}
              onChangeText={text =>
                setInvoiceData({...invoiceData, customerEmail: text})
              }
              placeholder="Enter customer email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.itemsHeader}>
            <Text style={styles.sectionTitle}>Line Items</Text>
            <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
              <Text style={styles.addItemText}>+ Add Item</Text>
            </TouchableOpacity>
          </View>

          {invoiceData.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Item {index + 1}</Text>
                {invoiceData.items.length > 1 && (
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <Text style={styles.removeItem}>❌</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={styles.input}
                value={item.description}
                onChangeText={text => updateItem(index, 'description', text)}
                placeholder="Item description"
                placeholderTextColor="#9CA3AF"
              />

              <View style={styles.itemRowInputs}>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  value={item.quantity}
                  onChangeText={text => updateItem(index, 'quantity', text)}
                  placeholder="Qty"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  value={item.rate}
                  onChangeText={text => updateItem(index, 'rate', text)}
                  placeholder="Rate"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                <View
                  style={[
                    styles.input,
                    styles.smallInput,
                    styles.amountDisplay,
                  ]}>
                  <Text style={styles.amountText}>
                    ${item.amount || '0.00'}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total: </Text>
            <Text style={styles.totalAmount}>${calculateTotal()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={invoiceData.notes}
            onChangeText={text => setInvoiceData({...invoiceData, notes: text})}
            placeholder="Additional notes or terms"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateInvoice}>
          <Text style={styles.createButtonText}>Create Invoice</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Management</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'create' && styles.activeTabText,
            ]}>
            Create Invoice
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manage' && styles.activeTab]}
          onPress={() => setActiveTab('manage')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'manage' && styles.activeTabText,
            ]}>
            Manage Invoices
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'create' ? (
        <CreateInvoiceForm />
      ) : (
        <View style={styles.manageContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search invoices..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <FlatList
            data={filteredInvoices}
            keyExtractor={item => item.id}
            renderItem={renderInvoiceItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    // backgroundColor: '#1E40AF',
  },
  backButton: {
    fontSize: 24,
    color: '#000',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addItemButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addItemText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  itemRow: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  removeItem: {
    fontSize: 14,
  },
  itemRowInputs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  smallInput: {
    flex: 1,
  },
  amountDisplay: {
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  manageContainer: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  invoiceId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  jobId: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  invoiceDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  invoiceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
});
